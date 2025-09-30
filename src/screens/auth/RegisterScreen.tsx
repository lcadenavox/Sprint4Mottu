import React, { useState } from 'react';
import { View } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { ThemedText } from '../../components/ui/ThemedText';
import { ThemedTextInput } from '../../components/ui/ThemedTextInput';
import { ThemedButton } from '../../components/ui/ThemedButton';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../contexts/AuthContext';

const schema = z.object({
  name: z.string().min(2, 'Informe seu nome'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

export default function RegisterScreen() {
  const { register: registerUser, loading } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const { formState, setValue, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '' },
    mode: 'onChange',
  });

  const onSubmit = async (data: FormData) => {
    setApiError(null);
    try {
      await registerUser(data);
    } catch (e: any) {
      setApiError(e?.message || 'Falha ao cadastrar');
    }
  };

  return (
    <Screen>
      <ThemedText style={{ fontSize: 24, fontWeight: '700', marginBottom: 8 }}>Criar conta</ThemedText>
      <ThemedTextInput
        label="Nome"
        onChangeText={(t) => setValue('name', t, { shouldValidate: true })}
        error={formState.errors.name?.message}
      />
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
      <ThemedButton title="Cadastrar" onPress={handleSubmit(onSubmit)} loading={loading} />
    </Screen>
  );
}
