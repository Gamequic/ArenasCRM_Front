import React, { useState } from "react";
import { View, Platform, Pressable, ScrollView } from "react-native";
import { TextInput, Text, Button, useTheme, SegmentedButtons } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-paper/src/components/Icon";

// Project imports
import PiecesService from "../../services/pieces.service";
import TogglePill from "../../components/TogglePill";
import Autocomplete from "../../components/Autocomplete";

const service = new PiecesService();

export default function AddPiece() {
	const { colors } = useTheme();

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
	const formattedDate = date.toISOString().split("T")[0];

	// Step 4: Gather form data and log JSON
	const handleSubmit = async () => {
		try {
			const data = {
				PublicId: parseInt(identifier),       // Enviar como número
				Date: formattedDate,
				Hospital: hospital,
				Medico: medico,
				Paciente: paciente,
				Pieza: pieza,
				Price: parseFloat(precio),           // Convertido a float
				IsPaid: paid,
				IsFactura: factura,
				IsAseguranza: aseguranza,
				PaidWithCard: paidWithCard,
				Status: progressStatus,
			};
			await service.create(data);
		} catch (error) {
			console.error("Failed to create piece:", error);
		}
	};

	const styles = {
		card: {
			backgroundColor: colors.surface,
			borderRadius: 12,
			elevation: 2,
		}
	}

	return (
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
						<TextInput
							label="Identificador"
							keyboardType="numeric"
							value={identifier}
							onChangeText={setIdentifier}
							mode="outlined"
							style={{backgroundColor: colors.surface}}
							textColor={colors.onSurface}
							activeOutlineColor={colors.primary}
							left={<TextInput.Icon icon={"bookmark-outline"} />}
						/>

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
							label="Hospital"
							options={["Hospital Angeles", "DEL SOL"]}
							onSelect={setHospital}
							value={hospital}
							icon="hospital-building"
						/>
						<Autocomplete
							label="Medico"
							options={["DRA GALVAN", "DR NAJERA", "DR DIAZ"]}
							onSelect={setMedico}
							value={medico}
							icon="doctor"
						/>
						<Autocomplete
							label="Paciente"
							options={["Lopez Perez Antonio", "Rivera Lopez Andrea"]}
							onSelect={setPaciente}
							value={paciente}
							icon="account"
						/>
						<Autocomplete
							label="Pieza"
							options={["Biopsia de Higado", "Biopsia endoscopia"]}
							onSelect={setPieza}
							value={pieza}
							icon="heart-pulse"
						/>
					</View>
				</View>

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
								<TextInput
									label="Precio"
									keyboardType="numeric"
									value={precio}
									onChangeText={setPrecio}
									mode="outlined"
									style={{backgroundColor: colors.surface}}
									textColor={colors.onSurface}
									activeOutlineColor={colors.primary}
									left={<TextInput.Icon icon={"currency-usd"} />}
								/>
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
					onPress={handleSubmit}
				>
					Añadir pieza
				</Button>
			</View>

		</ScrollView>
	);
}
