import React, { useState } from 'react';
import { View, FlatList, Pressable, useWindowDimensions } from 'react-native';
import { useStore } from '../context/StoreContext';
import { statusLabels, money } from '../constants/catalog';
import { Order } from '../types';
import { Title, Empty, Icon, Txt, s, C } from '../components/common/UI';

export const OrdersScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { state } = useStore();
  const [filter, setFilter] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);
  const { width } = useWindowDimensions();

  const filteredOrders = state.orders.filter(o => filter === 'all' || o.status === filter);

  const filterTabs = [
    { id: 'all', title: 'الكل' },
    ...Object.entries(statusLabels).map(([id, title]) => ({ id, title })),
  ];

  return (
    <FlatList
      data={filteredOrders}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: width < 650 ? 18 : 30 }}
      refreshing={refreshing}
      onRefresh={() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 450);
      }}
      ListHeaderComponent={
        <>
          <Title title="طلباتك، خطوة بخطوة" subtitle="كل طلباتك وتحديثاتها في مكان واحد." />

          {/* Filter Pills */}
          <View style={[s.row, { flexWrap: 'wrap', marginBottom: 20, gap: 8 }]}>
            {filterTabs.map(t => (
              <Pressable
                key={t.id}
                onPress={() => setFilter(t.id)}
                style={{
                  backgroundColor: filter === t.id ? '#FFF' : '#1A1A1A',
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderColor: '#333',
                  borderWidth: 1,
                }}
              >
                <Txt
                  bold
                  style={{
                    color: filter === t.id ? '#111' : '#AAA',
                    fontSize: 12,
                  }}
                >
                  {t.title}
                </Txt>
              </Pressable>
            ))}
          </View>
        </>
      }
      renderItem={({ item }) => (
        <Pressable
          onPress={() => navigation.navigate('OrderDetail', { id: item.id })}
          style={({ hovered }: any) => [
            s.panel,
            s.row,
            { padding: 18, marginBottom: 12 },
            hovered && { borderColor: '#555' },
          ]}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: '#222',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon
              name={item.kind === 'deposit' ? 'wallet-outline' : 'cube-outline'}
              size={22}
            />
          </View>

          <View style={{ flex: 1, gap: 3 }}>
            <Txt bold style={{ fontSize: 14 }}>{item.product}</Txt>
            <Txt style={{ fontSize: 11, color: C.muted }}>
              {item.id} • {new Date(item.date).toLocaleDateString('ar-EG')}
            </Txt>
          </View>

          <View style={{ alignItems: 'flex-end', gap: 3 }}>
            <Txt bold>{money(item.amount)}</Txt>
            <Txt
              style={{
                fontSize: 11,
                color:
                  item.status === 'completed'
                    ? '#899a8d'
                    : item.status === 'rejected'
                    ? '#d27c7c'
                    : '#AAA',
              }}
            >
              {statusLabels[item.status]}
            </Txt>
          </View>
          <Icon name="chevron-back" size={15} color="#777" />
        </Pressable>
      )}
      ListEmptyComponent={
        <Empty
          icon="receipt-outline"
          title={filter === 'all' ? 'رحلتك تبدأ بأول طلب' : 'لا توجد طلبات بهذه الحالة'}
          body={
            filter === 'all'
              ? 'استكشف خدماتنا، اختر ما يناسبك، وسنتابع معك كل خطوة.'
              : 'ستظهر طلباتك هنا عند تحديث حالتها.'
          }
          action="استكشف الخدمات"
          onAction={() =>
            navigation.navigate('Main', { screen: 'Categories', params: { category: 'all' } })
          }
        />
      }
    />
  );
};
