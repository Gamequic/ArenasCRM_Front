import React, { useState } from "react";
import { View } from "react-native";
import { TextInput, Text, Button, useTheme, Checkbox, HelperText } from "react-native-paper";
import Icon from "react-native-paper/src/components/Icon";
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

export default function LogIn({ setIsLogin }) {
	const { colors } = useTheme();

    // Form Data
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ rememberMe, setRememberMe ] = useState(true);

	const schema = yup.object().shape({
		Email: yup
			.string()
            .email("Debe ser un email valido")
			.required('El email es obligatorio'),
		Password: yup
			.string()
            .min(8, "Deben ser minimo 8 caracteres")
            .max(64, "No pueden ser mas de 64 caracteres")
			.required("El hospital es obligatorio"),
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
			Email: "",
			Password: ""
		},
	});

	const styles = {
		card: {
			backgroundColor: colors.surface,
			borderRadius: 12,
			elevation: 2,
		}
	}

	return (
        <View
            style={{
                paddingHorizontal: 16,
                gap: 12,
                margin: "auto"
            }}
        >
            <View style={{overflow: 'visible', width: 300, ...styles.card}}>
                <View
                    style={{
                        backgroundColor: colors.inversePrimary,
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: 8,
                        borderTopEndRadius: 12,
                        borderTopStartRadius: 12,
                    }}
                    >
                    <Icon source={require('./../../public/icon.png')} size={64} color={colors.onSurface} />
                    <Text
                        style={{
                        color: colors.onSurface,
                        fontSize: 24,
                        fontWeight: '600',
                        lineHeight: 34,
                        }}
                    >
                        Log In
                    </Text>
                </View>

                <View style={{paddingTop: 12, paddingHorizontal: 12, gap: 8}}>
                    <Controller
                        control={control}
                        name="Email"
                        defaultValue=""
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                label="Email"
                                value={email}
                                onChangeText={(e) => {onChange(e); setEmail(e)}}
                                onBlur={onBlur}
                                error={!!errors.Email}
                                mode="outlined"
                                style={{backgroundColor: colors.surface}}
                                textColor={colors.onSurface}
                                activeOutlineColor={colors.primary}
                                left={<TextInput.Icon icon="email" />}
                            />
                        )}
                    />
                    {errors.Email && (
                        <HelperText type="error">{errors.Email.message}</HelperText>
                    )}
                    <Controller
                        control={control}
                        name="Password"
                        defaultValue=""
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                label="Password"
                                value={password}
                                onChangeText={(e) => {onChange(e); setPassword(e)}}
                                onBlur={onBlur}
                                error={!!errors.Password}
                                mode="outlined"
                                style={{backgroundColor: colors.surface}}
                                textColor={colors.onSurface}
                                activeOutlineColor={colors.primary}
                                left={<TextInput.Icon icon="key" />}
                                right={<TextInput.Icon icon="eye" />}
                            />
                        )}
                    />
                    {errors.Password && (
                        <HelperText type="error">{errors.Password.message}</HelperText>
                    )}
                </View>
                <View
                    style={{
                        marginHorizontal: 12,
                        display: 'flex',
                        flexDirection: 'row'
                    }}
                >
                    <Checkbox
                        status={rememberMe ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setRememberMe(!rememberMe);
                        }}
                    />
                    <Text
                        style={{marginVertical: "auto", fontSize: 16}}
                    >Remember me</Text>
                </View>
                <View
                    style={{
                        marginHorizontal: 12,
                        paddingBottom: 12
                    }}
                >
                    <Button
                        mode="contained"
                        style={{ backgroundColor: colors.primary, zIndex: 1 }}
                        onPress={handleSubmit(() => {setIsLogin(true)})}
                    >
                        Log in
                    </Button>
                </View>
            </View>
        </View>
	);
}
