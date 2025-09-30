import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, View } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { ThemedText } from '../../components/ui/ThemedText';
import { ThemedButton } from '../../components/ui/ThemedButton';
import { api } from '../../services/api';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';

type Rental = { id: number; vehicleId: number; customerName: string; startDate: string; endDate?: string };

export default function RentalsListScreen() {
  const [data, setData] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const nav = useNavigation<any>();

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get<Rental[]>('/api/rentals');
      setData(res.data);
    } catch (e: any) {
      Alert.alert('Erro', e.message || 'Não foi possível carregar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = nav.addListener('focus', load);
    return unsubscribe;
  }, [nav]);

  const remove = async (id: number) => {
    try {
      await api.delete(`/api/rentals/${id}`);
      setData((old) => old.filter((v) => v.id !== id));
    } catch (e: any) {
      Alert.alert('Erro', e.message || 'Falha ao excluir');
    }
  };

  if (loading) return (
    <Screen>
      <ActivityIndicator />
    </Screen>
  );

  return (
    <Screen>
      <ThemedButton title="Novo aluguel" onPress={() => nav.navigate('RentalForm')} />
      <FlatList
        style={{ marginTop: 12 }}
        data={data}
        keyExtractor={(i) => String(i.id)}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => nav.navigate('RentalForm', { id: item.id })}
            style={{
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: 8,
              padding: 12,
              backgroundColor: theme.colors.surface,
            }}
          >
            <ThemedText style={{ fontWeight: '700' }}>{item.customerName}</ThemedText>
            <ThemedText>
              {new Date(item.startDate).toLocaleDateString()} {item.endDate ? `- ${new Date(item.endDate).toLocaleDateString()}` : ''}
            </ThemedText>
            <View style={{ height: 8 }} />
            <ThemedButton title="Excluir" onPress={() => remove(item.id)} />
          </Pressable>
        )}
      />
    </Screen>
  );
}
