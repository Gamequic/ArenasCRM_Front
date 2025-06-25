import React, { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import { TextInput } from "react-native-paper";

type AutocompleteProps = {
	label: string;
	options: string[];
	value: string;
	onSelect: (value: string) => void;
};

export default function Autocomplete({ label, options, value, onSelect }: AutocompleteProps) {
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
			onSelect(""); // Limpiar valor en el padre
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
		onSelect(val); // Notificar selección al padre
	};

	return (
		<View>
			<TextInput
				label={label}
				value={query}
				onChangeText={handleChange}
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
						position: "absolute",
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
