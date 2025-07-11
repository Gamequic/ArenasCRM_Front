import React, { useState, useEffect } from "react";
import { View, Platform, Pressable, FlatList, TouchableOpacity } from "react-native";
import { TextInput, Checkbox, Text, Chip, Button } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";

// Project imports
import PiecesService from "../../services/pieces.service";

const service = new PiecesService();

type AutocompleteProps = {
	label: string
	options: string[]
	value: string
	onSelect: (value: string) => void
}

function Autocomplete({ label, options, value, onSelect }: AutocompleteProps) {
	const [query, setQuery] = useState(value);
	const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
	const [showOptions, setShowOptions] = useState(false);

	useEffect(() => {
		setQuery(value);
	}, [value]);

	const handleChange = (text: string) => {
		setQuery(text);
		if (text.length === 0) {
			setShowOptions(false);
			setFilteredOptions([]);
			onSelect("");
		} else {
			const filtered = options.filter((opt) =>
				opt.toLowerCase().includes(text.toLowerCase())
			);
			setFilteredOptions(filtered);
			setShowOptions(true);
		}
	};

	const handleSelect = (val: string) => {
		setQuery(val);
		setShowOptions(false);
		onSelect(val);
	};

	return (
		<View>
			<TextInput
				label={label}
				value={query}
				onChangeText={handleChange}
				autoCorrect={false}
				autoCapitalize="none"
			/>

			{showOptions && filteredOptions.length > 0 && (
				<FlatList
					data={filteredOptions}
					keyExtractor={(item) => item}
					style={{
						backgroundColor: "white",
						borderRadius: 4,
						elevation: 4,
						zIndex: 4,
						marginTop: 48,
						position: "absolute"
					}}
					renderItem={({ item }) => (
						<TouchableOpacity onPress={() => handleSelect(item)}>
							<Text style={{ padding: 12 }}>{item}</Text>
						</TouchableOpacity>
					)}
				/>
			)}
		</View>
	);
}

export default function AddPiece() {
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
			console.log(data);
			await service.create(data);
		} catch (error) {
			console.error("Failed to create piece:", error);
		}
	};

	return (
		<View style={{ paddingHorizontal: 16, paddingVertical: 32, gap: 8 }}>
			<TextInput
				label="Identificador"
				keyboardType="numeric"
				value={identifier}
				onChangeText={setIdentifier}
			/>

			<Pressable
				style={{ width: "100%" }}
				onPress={() => setShow(true)}
			>
				<TextInput
					label="Select Date"
					value={date.toLocaleDateString()}
					editable={false}
					pointerEvents="none"
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
				label="Hospital"
				options={["Hospital Angeles", "DEL SOL"]}
				onSelect={setHospital}
				value={hospital}
			/>
			<Autocomplete
				label="Medico"
				options={["DRA GALVAN", "DR NAJERA", "DR DIAZ"]}
				onSelect={setMedico}
				value={medico}
			/>
			<Autocomplete
				label="Paciente"
				options={["Lopez Perez Antonio", "Rivera Lopez Andrea"]}
				onSelect={setPaciente}
				value={paciente}
			/>
			<Autocomplete
				label="Pieza"
				options={["Biopsia de Higado", "Biopsia endoscopia"]}
				onSelect={setPieza}
				value={pieza}
			/>

			<View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', gap: 8 }}>
				<View style={{ flex: 1 }}>
					<TextInput
					label="Precio"
					keyboardType="numeric"
					value={precio}
					onChangeText={setPrecio}
					/>
				</View>
				<Checkbox
					status={paid ? 'checked' : 'unchecked'}
					onPress={() => setPaid(!paid)}
					color="#6200ee"
					uncheckedColor="#999"
				/>
				<Text variant="bodyLarge">Pagado</Text>
			</View>

			<View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', gap: 8 }}>
				<Checkbox
					status={factura ? 'checked' : 'unchecked'}
					onPress={() => setFactura(!factura)}
					color="#6200ee"
					uncheckedColor="#999"
				/>
				<Text variant="bodyLarge">Factura</Text>
			</View>

			<View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', gap: 8 }}>
				<Checkbox
					status={aseguranza ? 'checked' : 'unchecked'}
					onPress={() => setAseguranza(!aseguranza)}
					color="#6200ee"
					uncheckedColor="#999"
				/>
				<Text variant="bodyLarge">Aseguranza</Text>
			</View>

			<View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', gap: 8 }}>
				<Checkbox
					status={paidWithCard ? 'checked' : 'unchecked'}
					onPress={() => setPaidWithCard(!paidWithCard)}
					color="#6200ee"
					uncheckedColor="#999"
				/>
				<Text variant="bodyLarge">Pagado con tarjeta</Text>
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
				<Chip
					icon="information"
					selected={progressStatus === 'En proceso'}
					onPress={() => setProgressStatus('En proceso')}
					style={{ backgroundColor: progressStatus === 'En proceso' ? '#6200ee' : undefined }}
				>
					En proceso
				</Chip>
				<Chip
					icon="information"
					selected={progressStatus === 'Terminado'}
					onPress={() => setProgressStatus('Terminado')}
					style={{ backgroundColor: progressStatus === 'Terminado' ? '#6200ee' : undefined }}
				>
					Terminado
				</Chip>
			</View>

			<Button
				mode="contained"
				style={{ marginTop: 16 }}
				onPress={handleSubmit}
			>
				Submit
			</Button>
		</View>
	);
}
