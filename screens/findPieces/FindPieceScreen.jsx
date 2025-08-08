import React, { useState, useRef } from "react";
import { View, Text, KeyboardAvoidingView, Platform, useWindowDimensions } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import PiecesService from "../../services/pieces.service";
import FiltersContainer from "./FiltersContainer";
import PiecesList from "./PiecesList";

const service = new PiecesService();

export default function FindPieceScreen() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const navigation = useNavigation();
  const { colors } = useTheme();

  const [results, setResults] = useState([]);
  const [filtersModalVisible, setFiltersModalVisible] = useState(false);

  const handleSearch = async (filters) => {
    try {
      console.log(filters)
      const data = await service.find(filters);
      setResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch pieces:", error);
      setResults([]);
    }
    if (!isLandscape) setFiltersModalVisible(false);
  };

  // Calculo de totales
  const totalGanado = results.reduce((sum, item) => sum + (item.Price || 0), 0);
  const totalPagado = results.reduce((sum, item) => sum + ((item.IsPaid ? item.Price : 0) || 0), 0);
  const totalPorCobrar = results.reduce((sum, item) => sum + ((!item.IsPaid ? item.Price : 0) || 0), 0);
  const totalEfectivo = results.reduce((sum, item) => sum + ((!item.PaidWithCard ? item.Price : 0) || 0), 0);
  const totalTarjeta = results.reduce((sum, item) => sum + ((item.PaidWithCard ? item.Price : 0) || 0), 0);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <View style={{ flex: 1, flexDirection: isLandscape ? "row" : "column" }}>
        <FiltersContainer
          isLandscape={isLandscape}
          visible={filtersModalVisible}
          setVisible={setFiltersModalVisible}
          onSearch={handleSearch}
          colors={colors}
        />

        <View style={{ flex: 1 }}>
          {!isLandscape && (
            <Button
              mode="contained"
              icon="filter-variant"
              style={{ margin: 8 }}
              onPress={() => setFiltersModalVisible(true)}
            >
              Filtros
            </Button>
          )}

          <Button
            mode="contained"
            icon="magnify"
            style={{ marginHorizontal: 8, marginBottom: 8 }}
            onPress={() => handleSearch({})}
          >
            🔍 Buscar
          </Button>

          <PiecesList results={results} navigation={navigation} colors={colors} />

          <View
            style={{
              padding: 16,
              backgroundColor: colors.tertiaryContainer,
              borderTopWidth: 1,
              borderColor: "#ccc",
            }}
          >
            <Text style={{ marginBottom: 8, fontWeight: "bold", fontSize: 16 }}>Resumen</Text>
            <Text>Total ganado: ${totalGanado.toFixed(2)}</Text>
            <Text>Total pagado: ${totalPagado.toFixed(2)}</Text>
            <Text>Por cobrar: ${totalPorCobrar.toFixed(2)}</Text>
            <Text>Total efectivo: ${totalEfectivo.toFixed(2)}</Text>
            <Text>Total tarjeta: ${totalTarjeta.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
