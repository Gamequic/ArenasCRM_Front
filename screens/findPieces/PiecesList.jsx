import React from "react";
import { View, FlatList, Text } from "react-native";
import { List, IconButton } from "react-native-paper";

export default function PiecesList({ results, navigation, colors }) {
  const renderItem = ({ item }) => (
    <List.Accordion
      title={`${item.PublicId} - ${item.Doctor.name}`}
      id={item.PublicId.toString()}
      left={(props) => <List.Icon {...props} icon="folder" color={colors.primary} />}
      right={(props) => (
        <List.Icon {...props} icon="cash" color={item.IsPaid ? "#4CAF50" : colors.error} />
      )}
    >
      <View
        style={{
          marginHorizontal: 12,
          padding: 12,
          backgroundColor: colors.surface,
          borderEndEndRadius: 12,
          borderStartEndRadius: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1, paddingRight: 8 }}>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>ID: {item.PublicId}</Text>
          <Text>
            Fecha:{" "}
            {new Date(item.Date)
              .toLocaleDateString("es-MX")
              .replaceAll("/", "-")}
          </Text>
          <Text>Hospital: {item.Hospital.name}</Text>
          <Text>Medico: {item.Doctor.name}</Text>
          <Text>Paciente: {item.PatientName}</Text>
          <Text>Pieza: {item.Pieza}</Text>
          <Text>Precio: ${item.Price?.toFixed(2)}</Text>
          <Text>Pagado: {item.IsPaid ? "✅" : "❌"}</Text>
          <Text>Factura: {item.IsFactura ? "✅" : "❌"}</Text>
          <Text>Aseguranza: {item.IsAseguranza ? "✅" : "❌"}</Text>
          <Text>Tarjeta: {item.PaidWithCard ? "✅" : "❌"}</Text>
        </View>

        <IconButton
          icon="pencil"
          size={24}
          onPress={() =>
            navigation.navigate("UpdatePiece", {
              itemID: item.ID,
            })
          }
          accessibilityLabel={`Editar pieza ${item.PublicId}`}
          iconColor={colors.primary}
          style={{ marginLeft: 8 }}
        />
      </View>
    </List.Accordion>
  );

  return (
    <FlatList
      contentContainerStyle={{
        padding: 16,
        gap: 8,
        paddingBottom: 0,
      }}
      data={results}
      keyExtractor={(item) => item.ID.toString()}
      keyboardShouldPersistTaps="handled"
      ListEmptyComponent={
        <Text style={{ marginTop: 16, textAlign: "center" }}>
          No se encontraron piezas.
        </Text>
      }
      renderItem={renderItem}
    />
  );
}
