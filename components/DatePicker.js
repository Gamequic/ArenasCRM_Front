// components/DatePickerCrossPlatform.js
import React, { useState } from "react";
import { Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

// En web usaremos react-datepicker para un popover más estético
// npm install react-datepicker date-fns
import "react-datepicker/dist/react-datepicker.css";
import DatePickerWeb from "react-datepicker";

export default function DatePickerCrossPlatform({ value, onChange }) {
	const [show, setShow] = useState(false);

	if (Platform.OS === "web") {
		return (
			<DatePickerWeb
				selected={value}
				onChange={(date) => {
					if (date) onChange(date);
				}}
				inline // Para que salga solo el calendario sin input extra
			/>
		);
	}

	return (
		<>
			{show && (
				<DateTimePicker
					value={value}
					mode="date"
					display={Platform.OS === "ios" ? "spinner" : "default"}
					onChange={(event, selectedDate) => {
						setShow(false);
						if (selectedDate) onChange(selectedDate);
					}}
				/>
			)}
		</>
	);
}
