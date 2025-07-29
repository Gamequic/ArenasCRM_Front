import React, { useState } from "react";
import {
  View,
  Platform,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
} from "react-native";
import { TextInput, Button, Text, Chip, useTheme, List, IconButton } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Project imports
import PiecesService from "../../services/pieces.service";
import Autocomplete from "../../components/Autocomplete";

const service = new PiecesService();

export default function FindPiece() {
  const navigation = useNavigation();
  const { colors } = useTheme();

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
      const filters: any = {};

      if (activeFilters.includes("Identificador") && publicId) {
        filters.publicId = publicId;
      }
      if (activeFilters.includes("Fecha") && date) {
        filters.date = formatDate(date);
      }
      if (activeFilters.includes("Rango de fechas")) {
        if (startDate) filters.startDate = formatDate(startDate);
        if (endDate) filters.endDate = formatDate(endDate);
      }
      if (activeFilters.includes("Hospital") && hospital) {
        filters.hospital = hospital;
      }
      if (activeFilters.includes("Medico") && medico) {
        filters.medico = medico;
      }
      if (activeFilters.includes("Paciente") && paciente) {
        filters.paciente = paciente;
      }

      if (isPaid !== null) filters.isPaid = isPaid;
      if (isFactura !== null) filters.isFactura = isFactura;
      if (isAseguranza !== null) filters.isAseguranza = isAseguranza;
      if (paidWithCard !== null) filters.paidWithCard = paidWithCard;

      const data = await service.find(filters);

      setResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch pieces:", error);
      setResults([]);
    }
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
      <View style={{ flex: 1, backgroundColor: colors.background }}>

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
            control={control}
            error={errors.Hospital}
            label="Hospital"
            options={["Hospital Angeles", "DEL SOL"]}
            onSelect={setHospital}
            value={hospital}
            icon="hospital-building"
          />
        )}

        {activeFilters.includes("Medico") && (
          <Autocomplete
            control={control}
            error={errors.Medico}
            label="Medico"
            options={["DRA GALVAN", "DR NAJERA", "DR DIAZ"]}
            onSelect={setMedico}
            value={medico}
            icon="doctor"
          />
        )}

        {activeFilters.includes("Paciente") && (
          <Autocomplete
            control={control}
            error={errors.Paciente}
            label="Paciente"
            options={["Lopez Perez Antonio", "Rivera Lopez Andrea"]}
            onSelect={setPaciente}
            value={paciente}
            icon="account"
          />
        )}

        <Button mode="contained" onPress={handleSearch} style={{ marginTop: 12, marginHorizontal: 8 }}>
          🔍 Buscar
        </Button>

        <List.AccordionGroup>
          <FlatList
            contentContainerStyle={{ padding: 16, gap: 8, paddingBottom: 0 }}
            data={results}
            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <Text style={{ marginTop: 16, textAlign: "center" }}>
                No se encontraron piezas.
              </Text>
            }
            renderItem={({ item }) => (
              <List.Accordion
                title={item.PublicId + ' - ' + item.Medico}
                id={item.PublicId}
                left={props => <List.Icon
                  {...props}
                  icon="folder"
                  color={colors.primary}
                />}
                right={props => <List.Icon
                  {...props}
                  icon="cash"
                  color={item.IsPaid ? "#4CAF50" : colors.error}
                />}
              >
                <View
                  style={{
                    marginHorizontal: 12,
                    padding: 12,
                    backgroundColor: colors.surface,
                    borderEndEndRadius: 12,
                    borderStartEndRadius: 12,
                    flexDirection: 'row',       // Para poner contenido e icono en fila
                    justifyContent: 'space-between', // Separar datos y botón
                    alignItems: 'center',
                  }}
                >
                  {/* Contenedor de texto con datos del paciente */}
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text variant="titleMedium">ID: {item.PublicId}</Text>
                    <Text>Fecha: {new Date(item.Date).toLocaleDateString("es-MX").replaceAll('/', '-')}</Text>
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

                  {/* Botón editar */}
                  <IconButton
                    icon="pencil"
                    size={24}
                    onPress={() => {
                      navigation.navigate('UpdatePiece', {
                        itemID: item.ID
                      });
                    }}
                    accessibilityLabel={`Editar pieza ${item.PublicId}`}
                    // opcional: color y estilo para mejor UI
                    iconColor={colors.primary}
                    style={{ marginLeft: 8 }}
                  />
                </View>
              </List.Accordion>
            )}
          />
        </List.AccordionGroup>

        {/* --- RESUMEN DE PAGOS --- */}
        <View
          style={{
            padding: 16,
            backgroundColor: colors.tertiaryContainer,
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
