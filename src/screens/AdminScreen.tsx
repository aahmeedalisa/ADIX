import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useStore } from '../context/StoreContext';
import { products, statusLabels, money } from '../constants/catalog';
import { ModalSheet } from '../components/common/ModalSheet';
import { DeveloperSettingsEditor } from '../components/admin/DeveloperSettingsEditor';
import { Page, Icon, Txt, Button, Field, Empty, Note, s, C } from '../components/common/UI';

export const AdminScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { state, updateOrder, updateShamSettings, addTicketReply, updateTicketStatus, showToast } =
    useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'payment' | 'tickets' | 'catalog' | 'developer'>('orders');
  const [shamName, setShamName] = useState(state.settings.shamName);
  const [shamNumber, setShamNumber] = useState(state.settings.shamNumber);
  const [confirmStatus, setConfirmStatus] = useState<{ id: string; status: any } | null>(null);
  const [ticketReplyText, setTicketReplyText] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  const pendingOrders = state.orders.filter(o => o.status === 'review');
  const totalRevenue = state.orders
    .filter(o => o.status === 'completed' && o.kind === 'order')
    .reduce((acc, cur) => acc + cur.amount, 0);

  const handleSavePayment = () => {
    if (shamName.trim().length < 2 || shamNumber.trim().length < 3) {
      return showToast('أدخل اسم مستفيد ورقم حساب صحيح');
    }
    updateShamSettings(shamName.trim(), shamNumber.trim());
  };

  const handleReplyTicket = (ticketId: string) => {
    if (!ticketReplyText.trim()) return;
    addTicketReply(ticketId, ticketReplyText.trim(), 'admin');
    setTicketReplyText('');
    showToast('تم إرسال رد الدعم الفني للعميل بنجاح');
  };

  return (
    <ModalSheet
      title="لوحة تحكم الإدارة"
      subtitle="إدارة الطلبات، المدفوعات، التذاكر، وإعدادات المطور"
      navigation={navigation}
      wide
    >
      <Page style={{ padding: 24 }}>
        {/* Stats Header */}
        <View style={[s.row, { gap: 10, marginBottom: 20 }]}>
          {[
            { label: 'إجمالي الطلبات', value: state.orders.length, icon: 'receipt-outline' },
            { label: 'بانتظار المراجعة', value: pendingOrders.length, icon: 'time-outline' },
            { label: 'إجمالي الإيرادات', value: money(totalRevenue), icon: 'bar-chart-outline' },
          ].map(stat => (
            <View key={stat.label} style={[s.panel, { flex: 1, padding: 14 }]}>
              <Icon name={stat.icon} size={20} color="#AAA" />
              <Txt bold style={{ fontSize: 22, marginTop: 8 }}>{stat.value}</Txt>
              <Txt style={{ color: C.muted, fontSize: 10 }}>{stat.label}</Txt>
            </View>
          ))}
        </View>

        {/* Tab Selector */}
        <View style={[s.row, { marginBottom: 20, flexWrap: 'wrap', gap: 8 }]}>
          {[
            { id: 'orders', label: 'إدارة الطلبات' },
            { id: 'payment', label: 'إعدادات الدفع' },
            { id: 'tickets', label: `الدعم الفني (${state.tickets.length})` },
            { id: 'catalog', label: 'دليل الخدمات' },
            { id: 'developer', label: 'إعدادات قسم المطور' },
          ].map(tab => (
            <Pressable
              key={tab.id}
              onPress={() => setActiveTab(tab.id as any)}
              style={{
                backgroundColor: activeTab === tab.id ? '#FFF' : '#1E1E1E',
                paddingHorizontal: 15,
                paddingVertical: 9,
                borderRadius: 8,
              }}
            >
              <Txt
                bold
                style={{
                  fontSize: 12,
                  color: activeTab === tab.id ? '#111' : '#AAA',
                }}
              >
                {tab.label}
              </Txt>
            </Pressable>
          ))}
        </View>

        {/* 1. Orders Tab */}
        {activeTab === 'orders' && (
          <>
            {state.orders.length ? (
              state.orders.map(order => (
                <View key={order.id} style={[s.panel, { padding: 18, marginBottom: 14 }]}>
                  <View style={[s.row, { justifyContent: 'space-between' }]}>
                    <View style={{ flex: 1 }}>
                      <Txt bold style={{ fontSize: 15 }}>{order.product}</Txt>
                      <Txt style={{ color: '#777', fontSize: 11 }}>
                        {order.id} • {order.target} • {statusLabels[order.status]}
                      </Txt>
                    </View>
                    <Txt bold style={{ fontSize: 20 }}>{money(order.amount)}</Txt>
                  </View>

                  <View style={[s.row, { flexWrap: 'wrap', marginTop: 14, gap: 8 }]}>
                    <Button
                      label="عرض الإثبات والتفاصيل"
                      secondary
                      onPress={() => navigation.navigate('OrderDetail', { id: order.id })}
                      style={{ minHeight: 36, paddingHorizontal: 12 }}
                    />

                    {order.status === 'review' && (
                      <Button
                        label={order.kind === 'deposit' ? 'اعتماد وإضافة الرصيد' : 'اعتماد وبدء التنفيذ'}
                        onPress={() =>
                          setConfirmStatus({
                            id: order.id,
                            status: order.kind === 'deposit' ? 'completed' : 'processing',
                          })
                        }
                        style={{ minHeight: 36, paddingHorizontal: 12 }}
                      />
                    )}

                    {order.status === 'processing' && (
                      <Button
                        label="تحديد كمكتمل"
                        onPress={() => setConfirmStatus({ id: order.id, status: 'completed' })}
                        style={{ minHeight: 36, paddingHorizontal: 12 }}
                      />
                    )}

                    {['review', 'processing'].includes(order.status) && (
                      <Button
                        label="رفض الطلب"
                        secondary
                        onPress={() => setConfirmStatus({ id: order.id, status: 'rejected' })}
                        style={{ minHeight: 36, paddingHorizontal: 12 }}
                      />
                    )}
                  </View>

                  {/* Confirmation modal */}
                  {confirmStatus?.id === order.id && (
                    <View
                      style={{
                        padding: 14,
                        marginTop: 14,
                        borderWidth: 1,
                        borderColor: '#555',
                        borderRadius: 8,
                        backgroundColor: '#222',
                      }}
                    >
                      <Txt bold style={{ marginBottom: 12 }}>
                        تأكيد تغيير حالة الطلب إلى "{statusLabels[confirmStatus.status]}"؟
                      </Txt>
                      <View style={s.row}>
                        <Button
                          label="تأكيد التحديث"
                          onPress={() => {
                            updateOrder(confirmStatus.id, confirmStatus.status);
                            setConfirmStatus(null);
                            showToast('تم تحديث حالة الطلب وإشعار العميل بنجاح');
                          }}
                        />
                        <Button
                          label="إلغاء"
                          secondary
                          onPress={() => setConfirmStatus(null)}
                        />
                      </View>
                    </View>
                  )}
                </View>
              ))
            ) : (
              <Empty
                icon="file-tray-outline"
                title="لا توجد طلبات للمراجعة"
                body="قم بإنشاء طلبات تجريبية أو شحن رصيد لتظهر هنا للمراجعة."
              />
            )}
          </>
        )}

        {/* 2. Payment Settings Tab */}
        {activeTab === 'payment' && (
          <View style={s.panel}>
            <Txt bold style={{ fontSize: 18, marginBottom: 8 }}>بيانات حساب شام كاش</Txt>
            <Txt style={{ fontSize: 12, color: C.muted, marginBottom: 18 }}>
              تظهر هذه البيانات للعملاء في صفحة الدفع والتحويل المالي.
            </Txt>
            <Field label="اسم المستفيد" value={shamName} onChangeText={setShamName} />
            <Field label="رقم حساب شام كاش" value={shamNumber} onChangeText={setShamNumber} />
            <Button label="حفظ إعدادات الدفع" icon="save-outline" onPress={handleSavePayment} />
          </View>
        )}

        {/* 3. Tickets Tab */}
        {activeTab === 'tickets' && (
          <>
            {state.tickets.length === 0 ? (
              <Empty icon="chatbubbles-outline" title="لا توجد تذاكر دعم" body="ستظهر تذاكر العملاء هنا." />
            ) : (
              state.tickets.map(ticket => (
                <View key={ticket.id} style={[s.panel, { marginBottom: 14 }]}>
                  <View style={[s.row, { justifyContent: 'space-between' }]}>
                    <Txt bold style={{ fontSize: 16 }}>{ticket.subject}</Txt>
                    <View style={s.badge}>
                      <Txt style={{ fontSize: 10 }}>{ticket.status}</Txt>
                    </View>
                  </View>
                  <Txt style={{ color: C.muted, marginVertical: 8, fontSize: 13 }}>{ticket.message}</Txt>
                  <Txt style={{ color: '#777', fontSize: 10 }}>
                    {ticket.id} • {new Date(ticket.date).toLocaleDateString('ar-EG')}
                  </Txt>

                  {/* Replies thread */}
                  {ticket.replies && ticket.replies.length > 0 && (
                    <View style={{ marginTop: 12, gap: 6, borderTopWidth: 1, borderTopColor: '#282828', paddingTop: 8 }}>
                      {ticket.replies.map(r => (
                        <View key={r.id} style={{ backgroundColor: '#222', padding: 8, borderRadius: 6 }}>
                          <Txt bold style={{ fontSize: 10, color: r.sender === 'support' ? '#899a8d' : '#CCC' }}>
                            {r.sender === 'support' ? 'رد الإدارة' : 'العميل'}
                          </Txt>
                          <Txt style={{ fontSize: 12, marginTop: 2 }}>{r.message}</Txt>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Admin reply input */}
                  <View style={[s.row, { marginTop: 12 }]}>
                    <View style={{ flex: 1 }}>
                      <Field
                        value={selectedTicket === ticket.id ? ticketReplyText : ''}
                        onChangeText={t => {
                          setSelectedTicket(ticket.id);
                          setTicketReplyText(t);
                        }}
                        placeholder="اكتب رد الدعم الفني للعميل..."
                      />
                    </View>
                    <Button
                      label="إرسال الرد"
                      onPress={() => handleReplyTicket(ticket.id)}
                      style={{ minHeight: 49 }}
                    />
                  </View>
                </View>
              ))
            )}
          </>
        )}

        {/* 4. Catalog Tab */}
        {activeTab === 'catalog' && (
          <View>
            <Note>الخدمات والأسعار مرتبطة بجدول الخدمات services في قاعدة البيانات.</Note>
            <View style={{ marginTop: 16 }}>
              {products.map(p => (
                <Pressable
                  key={p.id}
                  onPress={() => navigation.navigate('Service', { id: p.id })}
                  style={[s.panel, s.row, { marginBottom: 8, padding: 14 }]}
                >
                  <Icon name={p.icon} size={22} color={p.color || '#DDD'} />
                  <View style={{ flex: 1 }}>
                    <Txt bold style={{ fontSize: 13 }}>{p.name}</Txt>
                    <Txt style={{ fontSize: 11, color: C.muted }}>{p.unit}</Txt>
                  </View>
                  <Txt bold>{money(p.price)}</Txt>
                  <Icon name="chevron-back" size={14} color="#777" />
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* 5. Developer Settings Tab */}
        {activeTab === 'developer' && <DeveloperSettingsEditor />}
      </Page>
    </ModalSheet>
  );
};
