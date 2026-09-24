import React from 'react';
import { View, FlatList, Pressable } from 'react-native';
import { useStore } from '../context/StoreContext';
import { ModalSheet } from '../components/common/ModalSheet';
import { Icon, Txt, Empty, s, C } from '../components/common/UI';

export const NotificationsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { state, markNotificationsRead } = useStore();

  return (
    <ModalSheet title="الإشعارات والتنبيهات" subtitle="ابقَ على اطّلاع بكل جديد" navigation={navigation}>
      <FlatList
        data={state.notifications}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 22 }}
        ListHeaderComponent={
          state.notifications.some(n => !n.read) ? (
            <Pressable
              onPress={markNotificationsRead}
              style={{ alignSelf: 'flex-start', paddingBottom: 16 }}
            >
              <Txt style={{ fontSize: 12, color: '#AAA' }}>تحديد الكل كمقروء</Txt>
            </Pressable>
          ) : null
        }
        renderItem={({ item }) => (
          <View
            style={[
              s.panel,
              s.row,
              {
                alignItems: 'flex-start',
                padding: 16,
                marginBottom: 10,
                backgroundColor: item.read ? '#121212' : '#1D1D1D',
                borderColor: item.read ? C.border : '#444',
              },
            ]}
          >
            <Icon
              name={
                item.type === 'order'
                  ? 'receipt-outline'
                  : item.type === 'promo'
                  ? 'sparkles-outline'
                  : 'notifications-outline'
              }
              size={22}
              color={item.read ? '#888' : '#FFF'}
            />
            <View style={{ flex: 1, gap: 4 }}>
              <Txt bold style={{ fontSize: 14 }}>{item.title}</Txt>
              <Txt style={{ color: C.muted, fontSize: 12, lineHeight: 19 }}>{item.body}</Txt>
              <Txt style={{ color: '#666', fontSize: 10, marginTop: 4 }}>
                {new Date(item.date).toLocaleDateString('ar-EG')}
              </Txt>
            </View>
            {!item.read && (
              <View
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 4,
                  backgroundColor: '#FFF',
                  marginTop: 6,
                }}
              />
            )}
          </View>
        )}
        ListEmptyComponent={
          <Empty
            icon="notifications-off-outline"
            title="لا توجد إشعارات حالياً"
            body="ستصلك إشعارات حالة الطلبات وتأكيد الشحن فور صدورها هنا."
          />
        }
      />
    </ModalSheet>
  );
};
