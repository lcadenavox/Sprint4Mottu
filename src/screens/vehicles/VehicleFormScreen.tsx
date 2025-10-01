import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { ThemedText } from '../../components/ui/ThemedText';
import { ThemedTextInput } from '../../components/ui/ThemedTextInput';
import { ThemedButton } from '../../components/ui/ThemedButton';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motoService } from '../../services/resources/motoService';
import { useNavigation, useRoute } from '@react-navigation/native';

const schema = z.object({
  marca: z.string().min(2, 'Informe a marca'),
  modelo: z.string().min(1, 'Informe o modelo'),
  ano: z.coerce.number().int().min(1900, 'Ano inválido'),
});

type FormData = z.infer<typeof schema>;

export default function VehicleFormScreen() {
  const route = useRoute<any>();
  const nav = useNavigation<any>();
  const id = route.params?.id as number | undefined;
  const { formState, setValue, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: { marca: '', modelo: '', ano: new Date().getFullYear() },
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const load = async () => {
    if (!id) return;
    setFetching(true);
    try {
      const res = await motoService.get(id);
      reset({ marca: res.marca, modelo: res.modelo, ano: res.ano });
    } catch (e: any) {
      Alert.alert('Erro', e.message || 'Falha ao carregar');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (id) await motoService.update(id, data);
      else await motoService.create(data);
      Alert.alert('Sucesso', 'Dados salvos com sucesso');
      nav.goBack();
    } catch (e: any) {
      Alert.alert('Erro', e.message || 'Falha ao salvar');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Screen>
        <ActivityIndicator />
      </Screen>
    );
  }

  return (
    <Screen>
      <ThemedText style={{ fontSize: 20, fontWeight: '700', marginBottom: 8 }}>
  {id ? 'Editar moto' : 'Nova moto'}
      </ThemedText>
      <ThemedTextInput
        label="Marca"
        onChangeText={(t) => setValue('marca', t, { shouldValidate: true })}
        error={formState.errors.marca?.message}
      />
      <ThemedTextInput
        label="Modelo"
        onChangeText={(t) => setValue('modelo', t, { shouldValidate: true })}
        error={formState.errors.modelo?.message}
      />
      <ThemedTextInput
        label="Ano"
        keyboardType="numeric"
        onChangeText={(t) => setValue('ano', Number(t), { shouldValidate: true })}
        error={formState.errors.ano?.message}
      />
      <View style={{ height: 12 }} />
  <ThemedButton title="Salvar" onPress={handleSubmit(onSubmit as any)} loading={loading} />
    </Screen>
  );
}
