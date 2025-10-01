import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { ThemedText } from '../../components/ui/ThemedText';
import { ThemedTextInput } from '../../components/ui/ThemedTextInput';
import { ThemedButton } from '../../components/ui/ThemedButton';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { depositoService } from '../../services/resources/depositoService';
import { useRoute } from '@react-navigation/native';

const schema = z.object({
  nome: z.string().min(2, 'Informe o nome do depósito'),
  endereco: z.string().min(3, 'Informe o endereço'),
});

type FormData = z.infer<typeof schema>;

export default function DepositFormScreen() {
  const route = useRoute<any>();
  const id = route.params?.id as number | undefined;
  const { formState, setValue, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { nome: '', endereco: '' },
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const load = async () => {
    if (!id) return;
    setFetching(true);
    try {
      const res = await depositoService.get(id);
      reset({ nome: res.nome, endereco: res.endereco });
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
      if (id) await depositoService.update(id, data);
      else await depositoService.create(data);
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
        {id ? 'Editar depósito' : 'Novo depósito'}
      </ThemedText>
      <ThemedTextInput
        label="Nome"
        onChangeText={(t) => setValue('nome', t, { shouldValidate: true })}
        error={formState.errors.nome?.message}
      />
      <ThemedTextInput
        label="Endereço"
        onChangeText={(t) => setValue('endereco', t, { shouldValidate: true })}
        error={formState.errors.endereco?.message}
      />
      <View style={{ height: 12 }} />
      <ThemedButton title="Salvar" onPress={handleSubmit(onSubmit)} loading={loading} />
    </Screen>
  );
}
