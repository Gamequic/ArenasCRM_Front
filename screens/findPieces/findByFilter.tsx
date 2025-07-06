import React, { useState } from "react";
import {
  View,
  Platform,
  Pressable,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { TextInput, Button, Text, Chip } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";

// Project imports
import PiecesService from "../../services/pieces.service";
import Autocomplete from "../../components/Autocomplete";

const service = new PiecesService();

export default function FindPiece() {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [publicId, setPublicId] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hospital, setHospital] = useState('');
  const [medico, setMedico] = useState('');
  const [paciente, setPaciente] = useState('');
  const [showDatePicker, setShowDatePicker] = useState("");

  const [isPaid, setIsPaid] = useState<"true" | "false" | null>(null);
  const [isFactura, setIsFactura] = useState<"true" | "false" | null>(null);
  const [isAseguranza, setIsAseguranza] = useState<"true" | "false" | null>(null);
  const [paidWithCard, setPaidWithCard] = useState<"true" | "false" | null>(null);

  const [results, setResults] = useState<any[]>([]);

  const formatDate = (d: Date | null) => d ? d.toISOString().split("T")[0] : null;

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const cycleBoolean = (current: "true" | "false" | null): "true" | "false" | null => {
    if (current === null) return "true";
    if (current === "true") return "false";
    return null;
  };

  const handleSearch = async () => {
    try {
      const filters: any = {
        publicId,
        date: formatDate(date),
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        hospital,
        medico,
        paciente,
        isPaid,
        isFactura,
        isAseguranza,
        paidWithCard,
      };

      Object.keys(filters).forEach(key => {
        if (!filters[key]) delete filters[key];
      });

      const data = await service.find(filters);
      console.log(filters);
      console.log(data);

      setResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch pieces:", error);
      setResults([]);
    }
  };

  const totalGanado = results.reduce((sum, item) => sum + (item.Price || 0), 0);
  const totalPagado = results.reduce((sum, item) => sum + ((item.IsPaid ? item.Price : 0) || 0), 0);
  const totalPorCobrar = results.reduce((sum, item) => sum + ((!item.IsPaid ? item.Price : 0) || 0), 0);
  const totalEfectivo = results.reduce((sum, item) => sum + ((!item.PaidWithCard ? item.Price : 0) || 0), 0);
  const totalTarjeta = results.reduce((sum, item) => sum + ((item.PaidWithCard ? item.Price : 0) || 0), 0);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>

        <Text variant="titleMedium" style={{marginTop: 12, marginHorizontal: 8}}>Buscar por:</Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, margin: 8 }}>
          {[
            "Identificador", "Fecha", "Rango de fechas", "Hospital", "Medico", "Paciente"
          ].map((label) => (
            <Chip
              key={label}
              selected={activeFilters.includes(label)}
              onPress={() => toggleFilter(label)}
              style={{ margin: 4 }}
            >
              {label}
            </Chip>
          ))}

          <Chip
            selected={isPaid !== null}
            onPress={() => setIsPaid(cycleBoolean(isPaid))}
            style={{ margin: 4 }}
          >
            Pagado: {isPaid === "true" ? "✅" : isPaid === "false" ? "❌" : "—"}
          </Chip>
          <Chip
            selected={isFactura !== null}
            onPress={() => setIsFactura(cycleBoolean(isFactura))}
            style={{ margin: 4 }}
          >
            Con factura: {isFactura === "true" ? "✅" : isFactura === "false" ? "❌" : "—"}
          </Chip>
          <Chip
            selected={isAseguranza !== null}
            onPress={() => setIsAseguranza(cycleBoolean(isAseguranza))}
            style={{ margin: 4 }}
          >
            Aseguranza: {isAseguranza === "true" ? "✅" : isAseguranza === "false" ? "❌" : "—"}
          </Chip>
          <Chip
            selected={paidWithCard !== null}
            onPress={() => setPaidWithCard(cycleBoolean(paidWithCard))}
            style={{ margin: 4 }}
          >
            Tarjeta: {paidWithCard === "true" ? "✅" : paidWithCard === "false" ? "❌" : "—"}
          </Chip>
        </View>

        {activeFilters.includes("Identificador") && (
          <TextInput
            label="Identificador"
            value={publicId}
            onChangeText={setPublicId}
            keyboardType="numeric"
          />
        )}

        {activeFilters.includes("Fecha") && (
          <Pressable onPress={() => setShowDatePicker("fecha")}>
            <TextInput
              label="Fecha"
              value={date ? date.toLocaleDateString() : ""}
              editable={false}
              pointerEvents="none"
            />
          </Pressable>
        )}

        {activeFilters.includes("Rango de fechas") && (
          <>
            <Pressable onPress={() => setShowDatePicker("start")}>
              <TextInput
                label="Desde"
                value={startDate ? startDate.toLocaleDateString() : ""}
                editable={false}
                pointerEvents="none"
              />
            </Pressable>
            <Pressable onPress={() => setShowDatePicker("end")}>
              <TextInput
                label="Hasta"
                value={endDate ? endDate.toLocaleDateString() : ""}
                editable={false}
                pointerEvents="none"
              />
            </Pressable>
          </>
        )}

        {showDatePicker !== "" && (
          <DateTimePicker
            value={
              showDatePicker === "fecha"
                ? date || new Date()
                : showDatePicker === "start"
                ? startDate || new Date()
                : endDate || new Date()
            }
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setShowDatePicker("");
              if (!selectedDate) return;
              if (showDatePicker === "fecha") setDate(selectedDate);
              if (showDatePicker === "start") setStartDate(selectedDate);
              if (showDatePicker === "end") setEndDate(selectedDate);
            }}
          />
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

        <Button mode="contained" onPress={handleSearch} style={{ marginTop: 12, marginHorizontal: 8 }}>
          🔍 Buscar
        </Button>

        <ScrollView
          contentContainerStyle={{ padding: 16, gap: 8, paddingBottom: 0 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ marginTop: 16 }}>
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
                  <Text>Precio: ${item.Price?.toFixed(2)}</Text>
                  <Text>Pagado: {item.IsPaid ? "✅" : "❌"}</Text>
                  <Text>Factura: {item.IsFactura ? "✅" : "❌"}</Text>
                  <Text>Aseguranza: {item.IsAseguranza ? "✅" : "❌"}</Text>
                  <Text>Tarjeta: {item.PaidWithCard ? "✅" : "❌"}</Text>
                </View>
              )}
              ListEmptyComponent={
                <Text style={{ marginTop: 16, textAlign: "center" }}>
                  No se encontraron piezas.
                </Text>
              }
            />
          </View>
        </ScrollView>

        {/* --- RESUMEN DE PAGOS --- */}
        <View
          style={{
            padding: 16,
            backgroundColor: "#e0e0e0",
            borderTopWidth: 1,
            borderColor: "#ccc",
          }}
        >
          <Text variant="titleMedium" style={{ marginBottom: 8 }}>
            Resumen
          </Text>
          <Text>Total ganado: ${totalGanado.toFixed(2)}</Text>
          <Text>Total pagado: ${totalPagado.toFixed(2)}</Text>
          <Text>Por cobrar: ${totalPorCobrar.toFixed(2)}</Text>
          <Text>Total efectivo: ${totalEfectivo.toFixed(2)}</Text>
          <Text>Total tarjeta: ${totalTarjeta.toFixed(2)}</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
