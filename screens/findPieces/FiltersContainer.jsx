import React, { useState, useRef, useEffect } from "react";
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
  HelperText,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import RBSheet from "react-native-raw-bottom-sheet";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import Autocomplete from "../../components/Autocomplete";

export default function FiltersContainer({
  isLandscape,
  visible,
  setVisible,
  onSearch,
  colors,
}) {
  const [activeFilters, setActiveFilters] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState("");

  const filterSheetRef = useRef(null);

  // Yup schema with dynamic validation based on activeFilters
  const schema = yup.object().shape({
    publicId: yup
      .string()
      .test("required-if-identificador", "El identificador es obligatorio y debe ser numérico", function(value) {
        const { activeFilters = [] } = this.options.context || {};
        if (!activeFilters.includes("Identificador")) return true; // No validar si no activo
        return !!value && /^\d+$/.test(value);
      })
      .notRequired(),
    date: yup
      .date()
      .typeError("Fecha inválida")
      .test("required-if-fecha", "La fecha es obligatoria", function(value) {
        const { activeFilters = [] } = this.options.context || {};
        if (!activeFilters.includes("Fecha")) return true;
        return !!value;
      })
      .notRequired(),
    startDate: yup
      .date()
      .typeError("Fecha inválida")
      .test("required-if-rango-fechas", "La fecha de inicio es obligatoria", function(value) {
        const { activeFilters = [] } = this.options.context || {};
        if (!activeFilters.includes("Rango de fechas")) return true;
        return !!value;
      })
      .notRequired(),
    endDate: yup
      .date()
      .typeError("Fecha inválida")
      .test("required-if-rango-fechas", "La fecha final es obligatoria y no puede ser menor que la inicial", function(value) {
        const { activeFilters = [] } = this.options.context || {};
        if (!activeFilters.includes("Rango de fechas")) return true;
        const { startDate } = this.parent;
        return !!value && value >= startDate;
      })
      .notRequired(),
    hospital: yup
      .string()
      .test("required-if-hospital", "El hospital es obligatorio", function(value) {
        const { activeFilters = [] } = this.options.context || {};
        if (!activeFilters.includes("Hospital")) return true;
        return !!value;
      })
      .notRequired(),
    medico: yup
      .string()
      .test("required-if-medico", "El medico es obligatorio", function(value) {
        const { activeFilters = [] } = this.options.context || {};
        if (!activeFilters.includes("Medico")) return true;
        return !!value;
      })
      .notRequired(),
    paciente: yup
      .string()
      .test("required-if-paciente", "El paciente es obligatorio", function(value) {
        const { activeFilters = [] } = this.options.context || {};
        if (!activeFilters.includes("Paciente")) return true;
        return !!value;
      })
      .notRequired(),
    isPaid: yup.string().oneOf(["true", "false", null]).notRequired(),
    isFactura: yup.string().oneOf(["true", "false", null]).notRequired(),
    isAseguranza: yup.string().oneOf(["true", "false", null]).notRequired(),
    paidWithCard: yup.string().oneOf(["true", "false", null]).notRequired(),
  });

  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
    context: { activeFilters },
    defaultValues: {
      publicId: "",
      date: null,
      startDate: null,
      endDate: null,
      hospital: "",
      medico: "",
      paciente: "",
      isPaid: null,
      isFactura: null,
      isAseguranza: null,
      paidWithCard: null,
    },
  });

  // Abrir/cerrar RBSheet según visible (solo en portrait)
  useEffect(() => {
    if (!isLandscape) {
      if (visible) filterSheetRef.current?.open();
      else filterSheetRef.current?.close();
    }
  }, [visible, isLandscape]);

  // Validar al cambiar filtros activos
  useEffect(() => {
    trigger();
  }, [activeFilters, trigger]);

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

  const onApplyFilters = (data) => {
    const filters = {};

    if (activeFilters.includes("Identificador")) {
      if (data.publicId !== undefined) filters.publicId = data.publicId;
    }
    if (activeFilters.includes("Fecha")) {
      if (data.date) filters.date = data.date.toISOString().split("T")[0];
    }
    if (activeFilters.includes("Rango de fechas")) {
      if (data.startDate) filters.startDate = data.startDate.toISOString().split("T")[0];
      if (data.endDate) filters.endDate = data.endDate.toISOString().split("T")[0];
    }
    if (activeFilters.includes("Hospital")) {
      if (data.hospital !== undefined) filters.hospital = data.hospital;
    }
    if (activeFilters.includes("Medico")) {
      if (data.medico !== undefined) filters.medico = data.medico;
    }
    if (activeFilters.includes("Paciente")) {
      if (data.paciente !== undefined) filters.paciente = data.paciente;
    }

    if (data.isPaid !== null && data.isPaid !== undefined) filters.isPaid = data.isPaid;
    if (data.isFactura !== null && data.isFactura !== undefined) filters.isFactura = data.isFactura;
    if (data.isAseguranza !== null && data.isAseguranza !== undefined) filters.isAseguranza = data.isAseguranza;
    if (data.paidWithCard !== null && data.paidWithCard !== undefined) filters.paidWithCard = data.paidWithCard;

    onSearch(filters);
    if (!isLandscape && filterSheetRef.current) filterSheetRefRef.current.close();
    setVisible(false);
  };

  // Obtener valor booleano actual de un campo
  const getBooleanValue = (name) => watch(name);

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

        {[
          { label: "Pagado", name: "isPaid" },
          { label: "Con factura", name: "isFactura" },
          { label: "Aseguranza", name: "isAseguranza" },
          { label: "Tarjeta", name: "paidWithCard" },
        ].map(({ label, name }) => {
          const val = getBooleanValue(name);
          return (
            <Chip
              key={label}
              selected={val !== null}
              onPress={() => {
                const newVal = cycleBoolean(val);
                setValue(name, newVal, { shouldValidate: true });
              }}
              style={{ margin: 4 }}
            >
              {label}: {val === "true" ? "✅" : val === "false" ? "❌" : "—"}
            </Chip>
          );
        })}
      </View>

      {activeFilters.includes("Identificador") && (
        <Controller
          control={control}
          name="publicId"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                label="Identificador"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="numeric"
                error={!!errors.publicId}
                mode="outlined"
                style={{ marginBottom: 8, backgroundColor: "white" }}
              />
              {errors.publicId && (
                <HelperText type="error">{errors.publicId.message}</HelperText>
              )}
            </>
          )}
        />
      )}

      {activeFilters.includes("Fecha") && (
        <Controller
          control={control}
          name="date"
          render={({ field: { value, onChange } }) => (
            <>
              <Pressable onPress={() => setShowDatePicker("date")}>
                <TextInput
                  label="Fecha"
                  value={value ? new Date(value).toLocaleDateString() : ""}
                  editable={false}
                  pointerEvents="none"
                  mode="outlined"
                  style={{ marginBottom: 8, backgroundColor: "white" }}
                />
              </Pressable>
              {errors.date && (
                <HelperText type="error">{errors.date.message}</HelperText>
              )}
              {showDatePicker === "date" && (
                <DateTimePicker
                  value={value ? new Date(value) : new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(e, selectedDate) => {
                    setShowDatePicker("");
                    if (selectedDate) onChange(selectedDate);
                  }}
                />
              )}
            </>
          )}
        />
      )}

      {activeFilters.includes("Rango de fechas") && (
        <>
          <Controller
            control={control}
            name="startDate"
            render={({ field: { value, onChange } }) => (
              <>
                <Pressable onPress={() => setShowDatePicker("startDate")}>
                  <TextInput
                    label="Desde"
                    value={value ? new Date(value).toLocaleDateString() : ""}
                    editable={false}
                    pointerEvents="none"
                    mode="outlined"
                    style={{ marginBottom: 8, backgroundColor: "white" }}
                  />
                </Pressable>
                {errors.startDate && (
                  <HelperText type="error">{errors.startDate.message}</HelperText>
                )}
                {showDatePicker === "startDate" && (
                  <DateTimePicker
                    value={value ? new Date(value) : new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(e, selectedDate) => {
                      setShowDatePicker("");
                      if (selectedDate) onChange(selectedDate);
                    }}
                  />
                )}
              </>
            )}
          />
          <Controller
            control={control}
            name="endDate"
            render={({ field: { value, onChange } }) => (
              <>
                <Pressable onPress={() => setShowDatePicker("endDate")}>
                  <TextInput
                    label="Hasta"
                    value={value ? new Date(value).toLocaleDateString() : ""}
                    editable={false}
                    pointerEvents="none"
                    mode="outlined"
                    style={{ marginBottom: 8, backgroundColor: "white" }}
                  />
                </Pressable>
                {errors.endDate && (
                  <HelperText type="error">{errors.endDate.message}</HelperText>
                )}
                {showDatePicker === "endDate" && (
                  <DateTimePicker
                    value={value ? new Date(value) : new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(e, selectedDate) => {
                      setShowDatePicker("");
                      if (selectedDate) onChange(selectedDate);
                    }}
                  />
                )}
              </>
            )}
          />
        </>
      )}

      {activeFilters.includes("Hospital") && (
        <Controller
          control={control}
          name="hospital"
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              control={control}
              label="Hospital"
              options={["Hospital Angeles", "DEL SOL"]}
              onSelect={onChange}
              value={value}
              icon="hospital-building"
              error={!!errors.hospital}
              style={{ marginBottom: 8 }}
            />
          )}
        />
      )}

      {activeFilters.includes("Medico") && (
        <Controller
          control={control}
          name="medico"
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              control={control}
              label="Medico"
              options={["DRA GALVAN", "DR NAJERA", "DR DIAZ"]}
              onSelect={onChange}
              value={value}
              icon="doctor"
              error={!!errors.medico}
              style={{ marginBottom: 8 }}
            />
          )}
        />
      )}

      {activeFilters.includes("Paciente") && (
        <Controller
          control={control}
          name="paciente"
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              control={control}
              label="Paciente"
              options={["Lopez Perez Antonio", "Rivera Lopez Andrea"]}
              onSelect={onChange}
              value={value}
              icon="account"
              error={!!errors.paciente}
              style={{ marginBottom: 8 }}
            />
          )}
        />
      )}

      <Button
        mode="contained"
        onPress={handleSubmit(onApplyFilters)}
        style={{ marginTop: 12 }}
      >
        Aplicar filtros
      </Button>
    </ScrollView>
  );

  if (isLandscape) {
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

  return (
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
      onClose={() => {
        setVisible(false);
      }}
    >
      {filtersContent}
    </RBSheet>
  );
}
