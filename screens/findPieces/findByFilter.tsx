import React, { useState } from "react";
import { View, Platform, Pressable, FlatList } from "react-native";
import { TextInput, Button, Text, Chip } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";

// Project imports
import PiecesService from "../../services/pieces.service";
import Autocomplete from "../../components/Autocomplete";

const service = new PiecesService();

export default function FindPiece() {
  // Step 1: States for filters
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [identifier, setIdentifier] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [showDate, setShowDate] = useState(false);
  const [hospital, setHospital] = useState('');
  const [medico, setMedico] = useState('');
  const [paciente, setPaciente] = useState('');
  const [results, setResults] = useState<any[]>([]);

  // Step 2: Format date
  const formattedDate = date ? date.toISOString().split("T")[0] : null;

  // Step 3: Toggle filter visibility
  const toggleFilter = (filter: string) => {
    setActiveFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  // Step 4: Perform search
  const handleSearch = async () => {
    try {
      const filters = {
        identifier,
        date: formattedDate,
        hospital,
        medico,
        paciente,
      };
      const data = await service.find(filters);
      setResults(data);
    } catch (error) {
      console.error("Failed to fetch pieces:", error);
    }
  };

  return (
    <View style={{ padding: 16, gap: 8 }}>
      <Text variant="titleMedium">Buscar por:</Text>

      {/* Chips para seleccionar filtros */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {["Identificador", "Fecha", "Hospital", "Medico", "Paciente"].map((label) => (
          <Chip
            key={label}
            selected={activeFilters.includes(label)}
            onPress={() => toggleFilter(label)}
            style={{ margin: 4 }}
          >
            {label}
          </Chip>
        ))}
      </View>

      {/* Inputs condicionales */}
      {activeFilters.includes("Identificador") && (
        <TextInput
          label="Identificador"
          value={identifier}
          onChangeText={setIdentifier}
          keyboardType="numeric"
        />
      )}

      {activeFilters.includes("Fecha") && (
        <>
          <Pressable onPress={() => setShowDate(true)}>
            <TextInput
              label="Fecha"
              value={date ? date.toLocaleDateString() : ""}
              editable={false}
              pointerEvents="none"
            />
          </Pressable>
          {showDate && (
            <DateTimePicker
              value={date || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                setShowDate(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}
        </>
      )}

      {activeFilters.includes("Hospital") && (
        <Autocomplete
          label="Hospital"
          options={["Hospital Angeles", "DEL SOL"]}
          onSelect={setHospital}
          value={hospital}
        />
      )}

      {activeFilters.includes("Medico") && (
        <Autocomplete
          label="Medico"
          options={["DRA GALVAN", "DR NAJERA", "DR DIAZ"]}
          onSelect={setMedico}
          value={medico}
        />
      )}

      {activeFilters.includes("Paciente") && (
        <Autocomplete
          label="Paciente"
          options={["Lopez Perez Antonio", "Rivera Lopez Andrea"]}
          onSelect={setPaciente}
          value={paciente}
        />
      )}

      <Button mode="contained" onPress={handleSearch}>
        🔍 Buscar
      </Button>

      <FlatList
        data={results}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              marginVertical: 8,
              padding: 12,
              backgroundColor: "#f5f5f5",
              borderRadius: 8,
            }}
          >
            <Text variant="titleMedium">ID: {item.PublicId}</Text>
            <Text>Fecha: {item.date}</Text>
            <Text>Hospital: {item.Hospital}</Text>
            <Text>Medico: {item.Medico}</Text>
            <Text>Paciente: {item.Paciente}</Text>
            <Text>Pieza: {item.Pieza}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ marginTop: 16, textAlign: "center" }}>
            No se encontraron piezas.
          </Text>
        }
      />
    </View>
  );
}
