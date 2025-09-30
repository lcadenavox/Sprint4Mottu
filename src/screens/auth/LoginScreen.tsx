import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { ThemedText } from '../../components/ui/ThemedText';
import { ThemedTextInput } from '../../components/ui/ThemedTextInput';
import { ThemedButton } from '../../components/ui/ThemedButton';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

export default function LoginScreen() {
  const nav = useNavigation<any>();
  const { login, loading } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const { control, handleSubmit, formState, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  });

  const onSubmit = async (data: FormData) => {
    setApiError(null);
    try {
      await login(data);
    } catch (e: any) {
      setApiError(e?.message || 'Falha ao entrar');
    }
  };

  return (
    <Screen>
      <ThemedText style={{ fontSize: 24, fontWeight: '700', marginBottom: 8 }}>Bem-vindo</ThemedText>
      <ThemedText style={{ marginBottom: 16 }}>Entre para continuar</ThemedText>
      <ThemedTextInput
        label="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={(t) => setValue('email', t, { shouldValidate: true })}
        error={formState.errors.email?.message}
      />
      <ThemedTextInput
        label="Senha"
        secureTextEntry
        onChangeText={(t) => setValue('password', t, { shouldValidate: true })}
        error={formState.errors.password?.message}
      />
      {apiError ? <ThemedText style={{ color: 'red', marginBottom: 8 }}>{apiError}</ThemedText> : null}
      <ThemedButton title="Entrar" onPress={handleSubmit(onSubmit)} loading={loading} />
      <View style={{ height: 12 }} />
      <ThemedButton title="Criar conta" onPress={() => nav.navigate('Register')} />
    </Screen>
  );
}
