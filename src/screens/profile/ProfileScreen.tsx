import React from 'react';
import { Screen } from '../../components/layout/Screen';
import { ThemedText } from '../../components/ui/ThemedText';
import { ThemedButton } from '../../components/ui/ThemedButton';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../theme';

export default function ProfileScreen() {
  const { user, logout, loading } = useAuth();
  const { mode, toggle } = useTheme();
  return (
    <Screen>
      <ThemedText style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>Perfil</ThemedText>
      <ThemedText>Nome: {user?.name}</ThemedText>
      <ThemedText>Email: {user?.email}</ThemedText>
      <ThemedText style={{ marginVertical: 12 }}>Tema atual: {mode}</ThemedText>
      <ThemedButton
        title="Alternar tema"
        onPress={toggle}
        style={{ backgroundColor: '#1e40af' }}
      />
      <ThemedButton
        title="Sair"
        onPress={logout}
        loading={loading}
        variant="danger"
        style={{ marginTop: 12 }}
      />
    </Screen>
  );
}
