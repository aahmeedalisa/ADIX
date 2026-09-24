import React from 'react';
import { View, FlatList, Pressable, useWindowDimensions } from 'react-native';
import { useStore } from '../context/StoreContext';
import { money, statusLabels } from '../constants/catalog';
import { Title, Empty, Icon, Txt, Button, Note, s, C } from '../components/common/UI';

export const WalletScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { state } = useStore();
  const { width } = useWindowDimensions();

  const walletOrders = state.orders.filter(
    o => o.kind === 'deposit' || o.method === 'wallet'
  );
  const totalDeposits = state.orders
    .filter(o => o.kind === 'deposit' && o.status === 'completed')
    .reduce((acc, cur) => acc + cur.amount, 0);
  const totalSpent = state.orders
    .filter(o => o.method === 'wallet' && o.status !== 'rejected')
    .reduce((acc, cur) => acc + cur.amount, 0);

  return (
    <FlatList
      data={walletOrders}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: width < 650 ? 18 : 30 }}
      ListHeaderComponent={
        <>
          <Title title="محفظتك الرقمية" subtitle="رصيد إلكتروني واحد، واستخدام فوري لكافة الخدمات." />

          {/* Main Wallet Balance Box */}
          <View style={[s.panel, { backgroundColor: '#181818', padding: 26, marginBottom: 20 }]}>
            <View style={[s.row, { justifyContent: 'space-between' }]}>
              <View style={[s.row, { gap: 8 }]}>
                <Icon name="wallet-outline" size={22} color="#FFF" />
                <Txt bold style={{ fontSize: 16 }}>محفظة ADIX الرسمية</Txt>
              </View>
              <Txt style={{ color: '#777', fontSize: 12 }}>USD</Txt>
            </View>

            <Txt style={{ color: '#999', marginTop: 22, fontSize: 12 }}>الرصيد المتاح</Txt>
            <Txt bold style={{ fontSize: 44, lineHeight: 60 }}>{money(state.balance)}</Txt>

            <Button
              label="إضافة رصيد عبر شام كاش"
              icon="add"
              onPress={() => navigation.navigate('Payment', { deposit: true })}
              style={{ marginTop: 16, alignSelf: 'flex-start' }}
            />
          </View>

          {/* Stats Row */}
          <View style={[s.row, { marginBottom: 20, gap: 12 }]}>
            <View style={[s.panel, { flex: 1 }]}>
              <Txt style={{ color: C.muted, fontSize: 11 }}>إجمالي الإيداعات</Txt>
              <Txt bold style={{ fontSize: 22, marginTop: 8 }}>{money(totalDeposits)}</Txt>
            </View>
            <View style={[s.panel, { flex: 1 }]}>
              <Txt style={{ color: C.muted, fontSize: 11 }}>إجمالي المدفوعات</Txt>
              <Txt bold style={{ fontSize: 22, marginTop: 8 }}>{money(totalSpent)}</Txt>
            </View>
          </View>

          <Note icon="shield-checkmark-outline">
            يمكنك الدفع المباشر من رصيد المحفظة دون انتظار، ويتم رد الرصيد تلقائياً في حال تعذر تنفيذ أي طلب.
          </Note>

          <View style={{ marginTop: 28, marginBottom: 14 }}>
            <Title title="سجل حركات المحفظة" subtitle="الإيداعات وعمليات الشراء والخصومات" />
          </View>
        </>
      }
      renderItem={({ item }) => (
        <Pressable
          onPress={() => navigation.navigate('OrderDetail', { id: item.id })}
          style={({ hovered }: any) => [
            s.panel,
            s.row,
            { padding: 16, marginBottom: 10 },
            hovered && { borderColor: '#555' },
          ]}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: item.kind === 'deposit' ? '#1c281e' : '#262626',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon
              name={item.kind === 'deposit' ? 'arrow-down' : 'arrow-up'}
              size={18}
              color={item.kind === 'deposit' ? '#899a8d' : '#DDD'}
            />
          </View>

          <View style={{ flex: 1, gap: 2 }}>
            <Txt bold style={{ fontSize: 13 }}>
              {item.kind === 'deposit' ? 'إيداع رصيد بالمحفظة' : item.product}
            </Txt>
            <Txt style={{ fontSize: 11, color: C.muted }}>
              {item.id} • {new Date(item.date).toLocaleDateString('ar-EG')}
            </Txt>
          </View>

          <View style={{ alignItems: 'flex-end', gap: 2 }}>
            <Txt
              bold
              style={{
                color: item.kind === 'deposit' ? '#899a8d' : '#FFF',
              }}
            >
              {item.kind === 'deposit' ? `+${money(item.amount)}` : `−${money(item.amount)}`}
            </Txt>
            <Txt style={{ fontSize: 10, color: '#888' }}>
              {statusLabels[item.status]}
            </Txt>
          </View>
        </Pressable>
      )}
      ListEmptyComponent={
        <Empty
          icon="swap-horizontal-outline"
          title="محفظتك بانتظار أول عملية"
          body="قم بشحن رصيدك عبر شام كاش لتتمكن من الشراء بلمسة واحدة."
        />
      }
    />
  );
};
