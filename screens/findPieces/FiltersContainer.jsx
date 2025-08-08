import React, { useState, useRef } from "react";
import {
  View,
  Platform,
  Pressable,
  ScrollView,
} from "react-native";
import {
  TextInput,
  Chip,
  Button,
  Text,
  IconButton,
  useTheme,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import RBSheet from "react-native-raw-bottom-sheet";

import Autocomplete from "../../components/Autocomplete";

export default function FiltersContainer({
  isLandscape,
  visible,
  onOpen,
  onClose,
  onSearch,
  colors,
}) {
  // Estados internos de filtros
  const [activeFilters, setActiveFilters] = useState([]);
  const [publicId, setPublicId] = useState("");
  const [date, setDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [hospital, setHospital] = useState("");
  const [medico, setMedico] = useState("");
  const [paciente, setPaciente] = useState("");
  const [showDatePicker, setShowDatePicker] = useState("");

  const [isPaid, setIsPaid] = useState(null);
  const [isFactura, setIsFactura] = useState(null);
  const [isAseguranza, setIsAseguranza] = useState(null);
  const [paidWithCard, setPaidWithCard] = useState(null);

  const filterSheetRef = useRef(null);

  const toggleFilter = (filter) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const cycleBoolean = (current) => {
    if (current === null) return "true";
    if (current === "true") return "false";
    return null;
  };

  const formatDate = (d) => (d ? d.toISOString().split("T")[0] : null);

  const handleApplyFilters = () => {
    const filters = {};

    if (activeFilters.includes("Identificador") && publicId) filters.publicId = publicId;
    if (activeFilters.includes("Fecha") && date) filters.date = formatDate(date);
    if (activeFilters.includes("Rango de fechas")) {
      if (startDate) filters.startDate = formatDate(startDate);
      if (endDate) filters.endDate = formatDate(endDate);
    }
    if (activeFilters.includes("Hospital") && hospital) filters.hospital = hospital;
    if (activeFilters.includes("Medico") && medico) filters.medico = medico;
    if (activeFilters.includes("Paciente") && paciente) filters.paciente = paciente;

    if (isPaid !== null) filters.isPaid = isPaid;
    if (isFactura !== null) filters.isFactura = isFactura;
    if (isAseguranza !== null) filters.isAseguranza = isAseguranza;
    if (paidWithCard !== null) filters.paidWithCard = paidWithCard;

    onSearch(filters);
    if (!isLandscape && filterSheetRef.current) filterSheetRef.current.close();
  };

  const filtersContent = (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 8,
        }}
      >
        {[
          "Identificador",
          "Fecha",
          "Rango de fechas",
          "Hospital",
          "Medico",
          "Paciente",
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
          style={{ marginBottom: 8, backgroundColor: "white" }}
        />
      )}

      {activeFilters.includes("Fecha") && (
        <Pressable onPress={() => setShowDatePicker("fecha")}>
          <TextInput
            label="Fecha"
            value={date ? date.toLocaleDateString() : ""}
            editable={false}
            pointerEvents="none"
            style={{ marginBottom: 8, backgroundColor: "white" }}
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
              style={{ marginBottom: 8, backgroundColor: "white" }}
            />
          </Pressable>
          <Pressable onPress={() => setShowDatePicker("end")}>
            <TextInput
              label="Hasta"
              value={endDate ? endDate.toLocaleDateString() : ""}
              editable={false}
              pointerEvents="none"
              style={{ marginBottom: 8, backgroundColor: "white" }}
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
          icon="hospital-building"
          style={{ marginBottom: 8 }}
        />
      )}

      {activeFilters.includes("Medico") && (
        <Autocomplete
          label="Medico"
          options={["DRA GALVAN", "DR NAJERA", "DR DIAZ"]}
          onSelect={setMedico}
          value={medico}
          icon="doctor"
          style={{ marginBottom: 8 }}
        />
      )}

      {activeFilters.includes("Paciente") && (
        <Autocomplete
          label="Paciente"
          options={["Lopez Perez Antonio", "Rivera Lopez Andrea"]}
          onSelect={setPaciente}
          value={paciente}
          icon="account"
          style={{ marginBottom: 8 }}
        />
      )}

      <Button mode="contained" onPress={handleApplyFilters} style={{ marginTop: 12 }}>
        Aplicar filtros
      </Button>
    </ScrollView>
  );

  if (isLandscape) {
    // Menú lateral fijo a la izquierda
    return (
      <View
        style={{
          width: 300,
          backgroundColor: colors.surface,
          borderRightWidth: 1,
          borderRightColor: "#ccc",
          flexShrink: 0,
        }}
      >
        {filtersContent}
      </View>
    );
  }

  // Modal deslizante para portrait
  return (
    <>
      <RBSheet
        ref={filterSheetRef}
        closeOnPressMask={true}
        closeOnDragDown={true}
        animationType="slide"
        customModalProps={{
          animationIn: "slideInUp",
          animationOut: "slideOutDown",
          backdropTransitionInTiming: 0,
          backdropTransitionOutTiming: 0,
          statusBarTranslucent: true,
        }}
        customStyles={{
          wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
          draggableIcon: { backgroundColor: "#ccc" },
        }}
        onClose={onClose}
        visible={visible}
      >
        {filtersContent}
      </RBSheet>
    </>
  );
}
