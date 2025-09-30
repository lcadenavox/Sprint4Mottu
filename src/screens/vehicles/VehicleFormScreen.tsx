import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { ThemedText } from '../../components/ui/ThemedText';
import { ThemedTextInput } from '../../components/ui/ThemedTextInput';
import { ThemedButton } from '../../components/ui/ThemedButton';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../../services/api';
import { useRoute } from '@react-navigation/native';

const schema = z.object({
  model: z.string().min(2, 'Informe o modelo'),
  plate: z.string().min(7, 'Informe a placa'),
});

type FormData = z.infer<typeof schema>;

export default function VehicleFormScreen() {
  const route = useRoute<any>();
  const id = route.params?.id as number | undefined;
  const { formState, setValue, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { model: '', plate: '' },
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const load = async () => {
    if (!id) return;
    setFetching(true);
    try {
      const res = await api.get(`/api/vehicles/${id}`);
      reset({ model: res.data.model, plate: res.data.plate });
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
      if (id) await api.put(`/api/vehicles/${id}`, data);
      else await api.post('/api/vehicles', data);
      Alert.alert('Sucesso', 'Dados salvos com sucesso');
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
        {id ? 'Editar veículo' : 'Novo veículo'}
      </ThemedText>
      <ThemedTextInput
        label="Modelo"
        onChangeText={(t) => setValue('model', t, { shouldValidate: true })}
        error={formState.errors.model?.message}
      />
      <ThemedTextInput
        label="Placa"
        autoCapitalize="characters"
        onChangeText={(t) => setValue('plate', t, { shouldValidate: true })}
        error={formState.errors.plate?.message}
      />
      <View style={{ height: 12 }} />
      <ThemedButton title="Salvar" onPress={handleSubmit(onSubmit)} loading={loading} />
    </Screen>
  );
}
