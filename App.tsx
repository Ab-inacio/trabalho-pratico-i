import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

import { Despesa } from './types/Despesa';
import DespesaForm from './components/DespesaForm';
import DespesaItem from './components/DespesaItem';

export default function App() {
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const listaRef = useRef<FlatList<Despesa>>(null);

  const [despesaEditando, setDespesaEditando] =
    useState<Despesa | null>(null);

  // Adicionar uma nova despesa
  function adicionarDespesa(
    descricao: string,
    valor: number,
    categoria: string
  ) {
    const novaDespesa: Despesa = {
    id: Date.now().toString() + Math.random().toString(),
    descricao,
    valor,
    categoria,
    dataCadastro: new Date().toISOString(),
  };

    setDespesas((anteriores) => [...anteriores, novaDespesa]);
  }

  // Excluir uma despesa com confirmação
  function excluirDespesa(id: string) {
    Alert.alert(
      'Excluir despesa?',
      'Tem certeza de que deseja excluir esta despesa? Essa ação não poderá ser desfeita.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setDespesas((anteriores) =>
              anteriores.filter((despesa) => despesa.id !== id)
            );

            if (despesaEditando?.id === id) {
              setDespesaEditando(null);
            }
          },
        },
      ],
      { cancelable: true }
    );
  }

  // Selecionar uma despesa para edição
  function editarDespesa(despesa: Despesa) {
  setDespesaEditando(despesa);

  listaRef.current?.scrollToOffset({
    offset: 0,
    animated: true,
  });
}

  // Salvar as alterações da despesa
  function salvarEdicao(
    id: string,
    descricao: string,
    valor: number,
    categoria: string
  ) {
    setDespesas((anteriores) =>
      anteriores.map((despesa) =>
        despesa.id === id
          ? { ...despesa, descricao, valor, categoria }
          : despesa
      )
    );

    setDespesaEditando(null);
  }

  // Cancelar a edição
  function cancelarEdicao() {
    setDespesaEditando(null);
  }

  // Calcular o total de despesas
  const totalDespesas = despesas.reduce(
    (total, despesa) => total + despesa.valor,
    0
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          ref={listaRef}
          data={despesas}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View>
              <Text style={styles.titulo}>Cashly</Text>

              <Text style={styles.subtitulo}>
                Seu dinheiro, seu controle.
              </Text>

              <View style={styles.resumo}>
                <Text style={styles.resumoTitulo}>
                  Total de despesas
                </Text>
              
              <Text style={styles.resumoValor}>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(totalDespesas)}
              </Text>

                <Text style={styles.quantidade}>
                  {despesas.length} despesa(s) cadastrada(s)
                </Text>
              </View>

              <DespesaForm
                onAdicionar={adicionarDespesa}
                onSalvarEdicao={salvarEdicao}
                despesaEditando={despesaEditando}
                onCancelarEdicao={cancelarEdicao}
              />

              <Text style={styles.listaTitulo}>
                Histórico de despesas
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <DespesaItem
              despesa={item}
              onExcluir={excluirDespesa}
              onEditar={editarDespesa}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.vazio}>
              Nenhuma despesa cadastrada ainda.
            </Text>
          }
          contentContainerStyle={styles.conteudo}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
    paddingTop: StatusBar.currentHeight || 0,
  },
  conteudo: {
  padding: 20,
  paddingBottom: 180,
  flexGrow: 1,
  },
  titulo: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#171B32',
    marginTop: 15,
  },
  subtitulo: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 20,
  },
  resumo: {
    backgroundColor: '#171B32',
    padding: 24,
    borderRadius: 18,
    marginBottom: 20,
  },
  resumoTitulo: {
    fontSize: 16,
    color: '#C9A7FF',
    fontWeight: '500',
  },
  resumoValor: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: 12,
  },
  quantidade: {
    fontSize: 14,
    color: '#E2D9FF',
  },
  listaTitulo: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#171B32',
    marginBottom: 15,
  },
  vazio: {
    textAlign: 'center',
    color: '#64748B',
    marginTop: 20,
    fontSize: 15,
  },
});
