import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, View } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { ThemedText } from '../../components/ui/ThemedText';
import { ThemedButton } from '../../components/ui/ThemedButton';
import { motoService, Moto } from '../../services/resources/motoService';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';

// Baseado no Swagger "Moto": /api/Moto
type Vehicle = Moto;

export default function VehiclesListScreen() {
  const [data, setData] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = useTheme();
  const nav = useNavigation<any>();

  const load = async (pull = false) => {
    pull ? setRefreshing(true) : setLoading(true);
    try {
      const res = await motoService.list();
      setData(res);
    } catch (e: any) {
      Alert.alert('Erro', e.message || 'Não foi possível carregar');
    } finally {
      pull ? setRefreshing(false) : setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch immediately on mount
    load();
    // And also on screen focus
    const unsubscribe = nav.addListener('focus', load);
    return unsubscribe;
  }, [nav]);

  const remove = async (id: number) => {
    try {
      await motoService.remove(id);
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
  <ThemedButton title="Nova moto" onPress={() => nav.navigate('VehicleForm')} />
      <FlatList
        style={{ marginTop: 12 }}
        data={data}
        keyExtractor={(i) => String(i.id)}
        refreshing={refreshing}
        onRefresh={() => load(true)}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => nav.navigate('VehicleForm', { id: item.id })}
            style={{
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: 8,
              padding: 12,
              backgroundColor: theme.colors.surface,
            }}
          >
            <ThemedText style={{ fontWeight: '700' }}>{item.marca} {item.modelo}</ThemedText>
            <ThemedText>Ano: {item.ano}</ThemedText>
            <View style={{ height: 8 }} />
            <ThemedButton title="Excluir" onPress={() => remove(item.id)} />
          </Pressable>
        )}
      />
    </Screen>
  );
}
