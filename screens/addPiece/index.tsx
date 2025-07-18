import React, { useState } from "react";
import { View, Platform, Pressable, ScrollView } from "react-native";
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
	const { colors } = useTheme();

	const [successVisible, setSuccessVisible] = useState(false);

	// Step 1: Form field states
	const [identifier, setIdentifier] = useState('');
	const [date, setDate] = useState(new Date());
	const [show, setShow] = useState(false);
	const [hospital, setHospital] = useState('');
	const [medico, setMedico] = useState('');
	const [paciente, setPaciente] = useState('');
	const [pieza, setPieza] = useState('');
	const [precio, setPrecio] = useState('');

	// Step 2: Checkbox states
	const [paid, setPaid] = useState(false);
	const [factura, setFactura] = useState(false);
	const [aseguranza, setAseguranza] = useState(false);
	const [paidWithCard, setPaidWithCard] = useState(false); // ✅ nuevo estado

	// Step 3: Progress status (chips)
	const [progressStatus, setProgressStatus] = useState('En proceso');

	// Format date for backend: YYYY-MM-DD
	const formattedDate = new Date(date).toISOString(); 

	// Step 4: Gather form data and log JSON
	const onSubmit = async () => {
		const data = {
			PublicId: parseInt(identifier),
			date: formattedDate,
			Hospital: hospital,
			Medico: medico,
			Paciente: paciente,
			Pieza: pieza,
			Price: parseFloat(precio),
			IsPaid: paid,
			IsFactura: factura,
			IsAseguranza: aseguranza,
			PaidWithCard: paidWithCard,
			Status: progressStatus,
		};

		console.log("Sending data:", data);

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
		setMedico('');
		setPaciente('');
		setPieza('');
		setPrecio('');
		setPaid(false);
		setFactura(false);
		setAseguranza(false);
		setPaidWithCard(false);
		setProgressStatus('En proceso');
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
		Medico: yup
			.string()
			.required("El medico es obligatorio"),
		Paciente: yup
			.string()
			.required("El paciente es obligatorio"),
		Pieza: yup
			.string()
			.required("El pieza es obligatorio")
	});

	const {
		control,
		handleSubmit,
		reset,
		setError,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			Hospital: "",
			Medico: "",
			Paciente: "",
			Pieza: "",
		},
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
				<View style={{overflow: 'hidden', ...styles.card}}>
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
							Registro de pieza
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
						<Icon source="hospital-building" size={28} color={colors.onSurface} />
						<Text
							style={{
							color: colors.onSurface,
							fontSize: 24,
							fontWeight: '600',
							lineHeight: 34,
							}}
						>
							Solicitud
						</Text>
					</View>

					<View style={{padding: 12, gap: 8}}>
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
							error={errors.Medico}
							label="Medico"
							options={["DRA GALVAN", "DR NAJERA", "DR DIAZ"]}
							onSelect={setMedico}
							value={medico}
							icon="doctor"
						/>
						<Autocomplete
							control={control}
							error={errors.Paciente}
							label="Paciente"
							options={["Lopez Perez Antonio", "Rivera Lopez Andrea"]}
							onSelect={setPaciente}
							value={paciente}
							icon="account"
						/>
						<Autocomplete
							control={control}
							error={errors.Pieza}
							label="Pieza"
							options={["Biopsia de Higado", "Biopsia endoscopia"]}
							onSelect={setPieza}
							value={pieza}
							icon="heart-pulse"
						/>
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
								iconOn="file-document-check"
								iconOff="file-document-remove"
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

						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'center',
								width: '100%',
								gap: 8,
							}}
						>
							<SegmentedButtons
								value={progressStatus}
								onValueChange={setProgressStatus}
								buttons={[
									{
									value: 'En proceso',
									label: 'En proceso',
									icon: progressStatus === 'En proceso' ? 'progress-check' : 'progress-clock',
									style: {
										backgroundColor: progressStatus === 'En proceso'
										? colors.primaryContainer
										: colors.surface,
										borderColor: colors.outline,
									},
									// No se pone color de texto manual
									},
									{
									value: 'Terminado',
									label: 'Terminado',
									icon: progressStatus === 'Terminado' ? 'check-bold' : 'check-circle-outline',
									style: {
										backgroundColor: progressStatus === 'Terminado'
										? colors.primaryContainer
										: colors.surface,
										borderColor: colors.outline,
									},
									},
								]}
								style={{
									marginTop: 16,
									alignSelf: 'center',
								}}
							/>
						</View>
					</View>
				</View>
			</View>

			<View style={{ position: 'relative', alignItems: 'center', width: '100%' }}>
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
			</View>

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
				Piece added successfully!
			</Text>
			</Modal>
		</Portal>
		</>
	);
}
