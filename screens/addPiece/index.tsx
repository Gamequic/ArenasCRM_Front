import React, { useState } from "react";
import { useWindowDimensions, View, Platform, Pressable, ScrollView } from "react-native";
import { TextInput, Text, Button, useTheme, SegmentedButtons, HelperText, Modal, Portal, IconButton } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-paper/src/components/Icon";
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Project imports
import PiecesService from "../../services/pieces.service";
import TogglePill from "../../components/TogglePill";
import Autocomplete from "../../components/Autocomplete";

const service = new PiecesService();

export default function AddPiece() {
	const { width, height } = useWindowDimensions();
	const { colors } = useTheme();
	const isLandscape = width > height;

	const [successVisible, setSuccessVisible] = useState(false);
	const [show, setShow] = useState(false);

	// Form field states
	const [identifier, setIdentifier] = useState('');
	const [date, setDate] = useState(new Date());
	const [hospital, setHospital] = useState('');
	const [doctorName, setdoctorName] = useState('');
	const [patientName, setPatientName] = useState('');
	const [patientAge, setPatientAge] = useState('');
	const [pieza, setPieza] = useState('');
	const [precio, setPrecio] = useState('');
	const [description, setDescription] = useState('');

	// Checkbox states
	const [paid, setPaid] = useState(false);
	const [factura, setFactura] = useState(false);
	const [aseguranza, setAseguranza] = useState(false);
	const [paidWithCard, setPaidWithCard] = useState(false); // ✅ nuevo estado

	// Format date for backend: YYYY-MM-DD
	const formattedDate = new Date(date).toISOString(); 

	// Step 4: Gather form data and log JSON
	const onSubmit = async () => {
		const data = {
			PublicId: parseInt(identifier),
			date: formattedDate,
			Hospital: { Name : hospital },
			Doctor: { Name : doctorName },
			PatientName: patientName,
			PatientAge: parseInt(patientAge),
			Pieza: pieza,
			Price: parseFloat(precio),
			IsPaid: paid,
			IsFactura: factura,
			IsAseguranza: aseguranza,
			PaidWithCard: paidWithCard,
			Description: description,
		};

		console.log(data)

		try {
			await service.create(data);
		} catch (error) {
			if (error instanceof Error) {
				console.error("Failed to create piece:", error.message);
				if (error.message === "PublicId must be unique\n") {
					setError("identifier", {
						type: "manual",
						message: "El Identificador debe ser único.",
					});
				}
			} else {
				console.error("Unknown error:", String(error));
			}
			return
		}

		// Clean all data
		setIdentifier('');
		setDate(new Date());
		setHospital('');
		setdoctorName('');
		setPatientName('');
		setPatientAge('');
		setPieza('');
		setPrecio('');
		setPaid(false);
		setFactura(false);
		setAseguranza(false);
		setPaidWithCard(false);
		setDescription('En proceso');
		reset();

		// Show feed back to user
		setSuccessVisible(true);
	};

	const schema = yup.object().shape({
		identifier: yup
			.string()
			.required('El identificador es obligatorio')
			.matches(/^\d+$/, 'Debe contener solo números'),
		precio: yup
			.string()
			.required('El precio es obligatorio')
			.test('is-positive-number', 'Debe ser un número positivo', value => {
				if (!value) return false;
				const num = Number(value);
				return !isNaN(num) && num > 0;
			}),
		Hospital: yup
			.string()
			.required("El hospital es obligatorio"),
		Doctor: yup
			.string()
			.required("El nombre del doctor es obligatorio"),
		patientName: yup
			.string()
			.required("El nombre del paciente es obligatorio"),
		patientAge: yup
			.string()
			.test('is-positive-number', 'Debe ser un número positivo', value => {
				if (!value) return false;
				const num = Number(value);
				return !isNaN(num) && num > 0;
			}),
		Pieza: yup
			.string()
			.required("El pieza es obligatorio"),
		Description: yup
			.string()
	});

	const {
		control,
		handleSubmit,
		reset,
		setError,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema)
	});

	const styles = {
		card: {
			backgroundColor: colors.surface,
			borderRadius: 12,
			elevation: 2,
		}
	}

	return (
		<>
		<ScrollView 
			contentContainerStyle={{
				paddingVertical: 32,
				backgroundColor: colors.background
			}}
			showsVerticalScrollIndicator={false}
		>
			<View
				style={{
					paddingHorizontal: 16,
					gap: 12
				}}
			>
				<View
					style={{
						display: 'flex',
						flexDirection: isLandscape ? 'row' : 'column',
						gap: 12,
						width: '100%'
					}}
				>
					<View style={{flex: 1, overflow: 'hidden', ...styles.card}}>
						<View
							style={{
								backgroundColor: colors.inversePrimary,
								paddingVertical: 12,
								paddingHorizontal: 16,
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'flex-start',
								gap: 8,
							}}
							>
							<Icon source="archive" size={28} color={colors.onSurface} />
							<Text
								style={{
								color: colors.onSurface,
								fontSize: 24,
								fontWeight: '600',
								lineHeight: 34,
								}}
							>
								Origen de pieza
							</Text>
						</View>

						<View style={{padding: 12, gap: 8}}>
							<Controller
								control={control}
								name="identifier"
								defaultValue=""
								render={({ field: { onChange, onBlur, value } }) => (
									<TextInput
										label="Identificador"
										value={value}
										onChangeText={(e) => {onChange(e); setIdentifier(e)}}
										onBlur={onBlur}
										error={!!errors.identifier}
										mode="outlined"
										left={<TextInput.Icon icon="identifier" />}
										style={{backgroundColor: colors.surface}}
										textColor={colors.onSurface}
										activeOutlineColor={colors.primary}
									/>
								)}
							/>
							{errors.identifier && (
								<HelperText type="error">{errors.identifier.message}</HelperText>
							)}


							<Pressable
								style={{ width: "100%" }}
								onPress={() => setShow(true)}
							>
								<TextInput
									label="Fecha"
									value={date.toLocaleDateString()}
									editable={false}
									pointerEvents="none"
									mode="outlined"
									style={{backgroundColor: colors.surface}}
									textColor={colors.onSurface}
									activeOutlineColor={colors.primary}
									left={<TextInput.Icon icon={"calendar"} />}
								/>
							</Pressable>

							{show && (
								<DateTimePicker
									value={date}
									mode="date"
									display={Platform.OS === "ios" ? "spinner" : "default"}
									onChange={(event, selectedDate) => {
										setShow(false);
										if (selectedDate) setDate(selectedDate);
									}}
								/>
							)}

							<Autocomplete
								control={control}
								error={errors.Hospital}
								label="Hospital"
								options={["Hospital Angeles", "DEL SOL"]}
								onSelect={setHospital}
								value={hospital}
								icon="hospital-building"
							/>
							<Autocomplete
								control={control}
								error={errors.Doctor}
								label="Doctor"
								options={["DRA GALVAN", "DR NAJERA", "DR DIAZ"]}
								onSelect={setdoctorName}
								value={doctorName}
								icon="doctor"
							/>
						</View>
					</View>

					<View style={{flex: 1, overflow: 'visible', ...styles.card}}>
						<View
							style={{
								backgroundColor: colors.inversePrimary,
								paddingVertical: 12,
								paddingHorizontal: 16,
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'flex-start',
								gap: 8,
								borderTopEndRadius: 12,
								borderTopStartRadius: 12,
							}}
							>
							<Icon source="hospital-building" size={28} color={colors.onSurface} />
							<Text
								style={{
								color: colors.onSurface,
								fontSize: 24,
								fontWeight: '600',
								lineHeight: 34,
								}}
							>
								Paciente
							</Text>
						</View>

						<View style={{padding: 12, gap: 8}}>
							<Controller
								control={control}
								name="patientName"
								defaultValue=""
								render={({ field: { onChange, onBlur, value } }) => (
									<TextInput
										label="Nombre del paciente"
										value={value}
										onChangeText={(e) => {onChange(e); setPatientName(e)}}
										onBlur={onBlur}
										error={!!errors.patientName}
										mode="outlined"
										left={<TextInput.Icon icon="account" />}
										style={{backgroundColor: colors.surface}}
										textColor={colors.onSurface}
										activeOutlineColor={colors.primary}
									/>
								)}
							/>
							{errors.patientName && (
								<HelperText type="error">{errors.patientName.message}</HelperText>
							)}
							<Controller
								control={control}
								name="patientAge"
								defaultValue=""
								render={({ field: { onChange, onBlur, value } }) => (
									<TextInput
										label="Edad del paciente"
										value={value}
										onChangeText={(e) => {onChange(e); setPatientAge(e)}}
										onBlur={onBlur}
										error={!!errors.patientAge}
										mode="outlined"
										style={{backgroundColor: colors.surface}}
										textColor={colors.onSurface}
										activeOutlineColor={colors.primary}
										left={<TextInput.Icon icon="cake-variant" />}
									/>
								)}
							/>
							{errors.patientAge && (
								<HelperText type="error">{errors.patientAge.message}</HelperText>
							)}
							<Autocomplete
								control={control}
								error={errors.Pieza}
								label="Pieza"
								options={["Biopsia de Higado", "Biopsia endoscopia"]}
								onSelect={setPieza}
								value={pieza}
								icon="heart-pulse"
							/>
							<Controller
								control={control}
								name="Description"
								defaultValue=""
								render={({ field: { onChange, onBlur, value } }) => (
									<TextInput
										label="Description"
										value={value}
										onChangeText={(e) => {onChange(e); setDescription(e)}}
										onBlur={onBlur}
										error={!!errors.Description}
										mode="outlined"
										multiline
										numberOfLines={4}
										style={{backgroundColor: colors.surface}}
										textColor={colors.onSurface}
										activeOutlineColor={colors.primary}
										left={<TextInput.Icon icon="image-text" />}
									/>
								)}
							/>
							{errors.Description && (
								<HelperText type="error">{errors.Description.message}</HelperText>
							)}
						</View>
					</View>
				</View>

				<View style={{overflow: 'visible', ...styles.card}}>
					<View
						style={{
							backgroundColor: colors.inversePrimary,
							paddingVertical: 12,
							paddingHorizontal: 16,
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'flex-start',
							gap: 8,
							borderTopEndRadius: 12,
							borderTopStartRadius: 12,
						}}
						>
						<Icon source="cash" size={28} color={colors.onSurface} />
						<Text
							style={{
							color: colors.onSurface,
							fontSize: 24,
							fontWeight: '600',
							lineHeight: 34,
							}}
						>
							Pago
						</Text>
					</View>
					
					<View style={{padding: 12}}>
						<View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', gap: 8 }}>
							<View style={{ flex: 1 }}>
								<Controller
									control={control}
									name="precio"
									defaultValue=""
									render={({ field: { onChange, onBlur, value } }) => (
										<TextInput
											label="Precio"
											value={value}
											onChangeText={(e) => {onChange(e) ; setPrecio(e)}}
											onBlur={onBlur}
											keyboardType="numeric"
											error={!!errors.precio}
											mode="outlined"
											left={<TextInput.Icon icon="cash" />}
											style={{backgroundColor: colors.surface}}
											textColor={colors.onSurface}
											activeOutlineColor={colors.primary}
										/>
									)}
								/>
								{errors.precio && (
								<HelperText type="error">{errors.precio.message}</HelperText>
								)}
							</View>
						</View>

						<View
							style={{
								flexDirection: "row",
								flexWrap: "wrap",
								justifyContent: "space-between",
								rowGap: 12,
								columnGap: 12,
								marginTop: 12,
							}}
							>
							<TogglePill
								label="Pagado"
								iconOn="cash-check"
								iconOff="cash-remove"
								value={paid}
								onToggle={() => setPaid(!paid)}
							/>
							<TogglePill
								label="Factura"
								iconOn="ticket"
								iconOff="ticket-outline"
								value={factura}
								onToggle={() => setFactura(!factura)}
							/>
							<TogglePill
								label="Aseguranza"
								iconOn="shield-check"
								iconOff="shield-remove"
								value={aseguranza}
								onToggle={() => setAseguranza(!aseguranza)}
							/>
							<TogglePill
								label="Tarjeta"
								iconOn="credit-card-check"
								iconOff="credit-card-remove"
								value={paidWithCard}
								onToggle={() => setPaidWithCard(!paidWithCard)}
							/>
						</View>
					</View>
				</View>
			</View>

			{ isLandscape ? 
			<View
				style={{
					margin: 8
				}}
			>
				<Button
					mode="contained"
					style={{ marginTop: 16, backgroundColor: colors.primary, zIndex: 1, top: 12 }}
					onPress={handleSubmit(onSubmit)}
				>
					Añadir pieza
				</Button>
			</View>
			:
			(<View style={{ position: 'relative', alignItems: 'center', width: '100%' }}>
				<View
					style={{
					position: 'absolute',
					width: '200%',
					aspectRatio: 1,
					borderRadius: 9999,
					backgroundColor: colors.surface,
					top: 6,
					left: '-50%',
					zIndex: 0,
					}}
				/>
				<Button
					mode="contained"
					style={{ marginTop: 16, backgroundColor: colors.primary, zIndex: 1, top: 12 }}
					onPress={handleSubmit(onSubmit)}
				>
					Añadir pieza
				</Button>
			</View>)
			}

		</ScrollView>

		<Portal>
			<Modal
			visible={successVisible}
			onDismiss={() => setSuccessVisible(false)}
			contentContainerStyle={{
				backgroundColor: colors.primary, // 🎨 color del modal
				padding: 24,
				marginHorizontal: 32,
				borderRadius: 12,
				alignItems: "center",
			}}
			>
			<IconButton
				icon="check-circle"
				size={48}
				iconColor={colors.onPrimary} // ✅ color del icono sobre fondo primary
			/>
			<Text
				style={{
				color: colors.onPrimary, // ✅ texto legible sobre fondo
				fontSize: 18,
				marginTop: 8,
				textAlign: "center",
				fontWeight: "bold",
				}}
			>
				¡Pieza agregada exitosamente!
			</Text>
			</Modal>
		</Portal>
		</>
	);
}
