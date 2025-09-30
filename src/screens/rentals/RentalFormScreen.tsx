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
  vehicleId: z.coerce.number().int().positive('Informe o veículo'),
  customerName: z.string().min(2, 'Informe o cliente'),
  startDate: z.string().min(10, 'Informe a data de início (YYYY-MM-DD)'),
  endDate: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function RentalFormScreen() {
  const route = useRoute<any>();
  const id = route.params?.id as number | undefined;
  const { formState, setValue, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: { vehicleId: 0, customerName: '', startDate: '', endDate: '' },
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const load = async () => {
    if (!id) return;
    setFetching(true);
    try {
      const res = await api.get(`/api/rentals/${id}`);
      reset({
        vehicleId: res.data.vehicleId,
        customerName: res.data.customerName,
        startDate: res.data.startDate?.slice(0, 10) || '',
        endDate: res.data.endDate?.slice(0, 10) || '',
      });
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
      if (id) await api.put(`/api/rentals/${id}`, data);
      else await api.post('/api/rentals', data);
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
        {id ? 'Editar aluguel' : 'Novo aluguel'}
      </ThemedText>
      <ThemedTextInput
        label="ID do Veículo"
        keyboardType="numeric"
        onChangeText={(t) => setValue('vehicleId', Number(t), { shouldValidate: true })}
        error={formState.errors.vehicleId?.message}
      />
      <ThemedTextInput
        label="Cliente"
        onChangeText={(t) => setValue('customerName', t, { shouldValidate: true })}
        error={formState.errors.customerName?.message}
      />
      <ThemedTextInput
        label="Data início"
        placeholder="YYYY-MM-DD"
        onChangeText={(t) => setValue('startDate', t, { shouldValidate: true })}
        error={formState.errors.startDate?.message}
      />
      <ThemedTextInput
        label="Data fim (opcional)"
        placeholder="YYYY-MM-DD"
        onChangeText={(t) => setValue('endDate', t, { shouldValidate: true })}
        error={formState.errors.endDate?.message}
      />
      <View style={{ height: 12 }} />
  <ThemedButton title="Salvar" onPress={handleSubmit(onSubmit as any)} loading={loading} />
    </Screen>
  );
}
