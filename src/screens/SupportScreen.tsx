import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useStore } from '../context/StoreContext';
import { ModalSheet } from '../components/common/ModalSheet';
import { Page, Icon, Txt, Button, Field, s, C } from '../components/common/UI';

export const SupportScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { state, addTicket, addTicketReply } = useStore();
  const [subject, setSubject] = useState(
    route.params?.orderId ? `استفسار حول الطلب ${route.params.orderId}` : ''
  );
  const [message, setMessage] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number>(-1);
  const [replyText, setReplyText] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const faqs = [
    {
      q: 'كيف يعمل الشحن عبر شام كاش؟',
      a: 'تظهر بيانات الحساب واسم المستفيد، ثم تقوم بالتحويل من تطبيق شام كاش وترفق صورة إشعار التحويل. يراجع فريقنا الطلب ويعتمد الشحن فوراً.',
    },
    {
      q: 'كم يستغرق تنفيذ خدمات السوشيال ميديا وشحن الألعاب؟',
      a: 'شحن الألعاب فوري ويتم خلال 5 دقائق. خدمات السوشيال ميديا تبدأ بالوصول تدريجياً وبأمان بين 5 دقائق وساعتين كحد أقصى.',
    },
    {
      q: 'هل يطلب فريق الدعم كلمة مرور حساباتي؟',
      a: 'لا نطلب كلمة مرور حسابك مطلقاً تحت أي ظرف. نطلب فقط معرّف اللاعب أو رابط حسابك العام أو البريد الإلكتروني.',
    },
  ];

  const handleCreateTicket = () => {
    if (subject.trim().length < 3 || message.trim().length < 5) return;
    addTicket(subject, message, route.params?.orderId);
    setSubject('');
    setMessage('');
  };

  const handleSendReply = (ticketId: string) => {
    if (!replyText.trim()) return;
    addTicketReply(ticketId, replyText, 'user');
    setReplyText('');
  };

  return (
    <ModalSheet title="الدعم الفني والمساعدة" subtitle="فريق خدمة العملاء جاهز لخدمتك" navigation={navigation}>
      <Page style={{ padding: 25 }}>
        {/* Contact Banner */}
        <View style={[s.panel, s.row, { marginBottom: 20 }]}>
          <Icon name="headset-outline" size={32} color="#FFF" />
          <View style={{ flex: 1 }}>
            <Txt bold style={{ fontSize: 16 }}>نحن هنا لمساعدتك على مدار الساعة</Txt>
            <Txt style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
              راجع الأسئلة الشائعة أو افتح تذكرة وسنرد عليك بأسرع وقت.
            </Txt>
          </View>
        </View>

        {/* FAQs */}
        <Txt bold style={{ marginBottom: 12, fontSize: 16 }}>الأسئلة الشائعة</Txt>
        {faqs.map((faq, idx) => (
          <Pressable
            key={faq.q}
            onPress={() => setExpandedFaq(expandedFaq === idx ? -1 : idx)}
            style={[s.panel, { padding: 16, marginBottom: 10 }]}
          >
            <View style={[s.row, { justifyContent: 'space-between' }]}>
              <Txt bold style={{ fontSize: 13, flex: 1 }}>{faq.q}</Txt>
              <Icon name={expandedFaq === idx ? 'remove' : 'add'} size={17} color="#999" />
            </View>
            {expandedFaq === idx && (
              <Txt style={{ color: C.muted, fontSize: 12, marginTop: 10, lineHeight: 20 }}>
                {faq.a}
              </Txt>
            )}
          </Pressable>
        ))}

        {/* Create Ticket */}
        <Txt bold style={{ fontSize: 18, marginTop: 24, marginBottom: 16 }}>إنشاء تذكرة دعم جديدة</Txt>
        <Field
          label="موضوع التذكرة"
          value={subject}
          onChangeText={setSubject}
          placeholder="بماذا يمكننا مساعدتك اليوم؟"
        />
        <Field
          label="تفاصيل الرسالة"
          value={message}
          onChangeText={setMessage}
          multiline
          placeholder="اكتب استفسارك أو مشكلتك بالتفصيل..."
        />
        <Button
          label="إرسال التذكرة"
          icon="send"
          onPress={handleCreateTicket}
          disabled={subject.trim().length < 3 || message.trim().length < 5}
        />

        {/* Existing Tickets */}
        {state.tickets.length > 0 && (
          <View style={{ marginTop: 28 }}>
            <Txt bold style={{ fontSize: 18, marginBottom: 14 }}>تذاكري السابقة</Txt>
            {state.tickets.map(ticket => (
              <View key={ticket.id} style={[s.panel, { marginBottom: 12, padding: 18 }]}>
                <View style={[s.row, { justifyContent: 'space-between' }]}>
                  <Txt bold style={{ fontSize: 15 }}>{ticket.subject}</Txt>
                  <View style={s.badge}>
                    <Txt style={{ fontSize: 10 }}>
                      {ticket.status === 'open'
                        ? 'مفتوحة'
                        : ticket.status === 'in_progress'
                        ? 'قيد المتابعة'
                        : 'مغلقة'}
                    </Txt>
                  </View>
                </View>
                <Txt style={{ color: C.muted, fontSize: 12, marginTop: 8 }}>{ticket.message}</Txt>
                <Txt style={{ color: '#666', fontSize: 10, marginTop: 10 }}>
                  {ticket.id} • {new Date(ticket.date).toLocaleDateString('ar-EG')}
                </Txt>

                {/* Ticket Replies */}
                {ticket.replies && ticket.replies.length > 0 && (
                  <View style={{ marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#282828', gap: 8 }}>
                    {ticket.replies.map(rep => (
                      <View
                        key={rep.id}
                        style={{
                          backgroundColor: rep.sender === 'support' ? '#1f2420' : '#222',
                          padding: 10,
                          borderRadius: 8,
                        }}
                      >
                        <Txt bold style={{ fontSize: 11, color: rep.sender === 'support' ? '#899a8d' : '#FFF' }}>
                          {rep.sender === 'support' ? 'فريق الدعم الفني' : 'أنت'}
                        </Txt>
                        <Txt style={{ fontSize: 12, marginTop: 3 }}>{rep.message}</Txt>
                      </View>
                    ))}
                  </View>
                )}

                {/* Quick reply */}
                <View style={[s.row, { marginTop: 12 }]}>
                  <View style={{ flex: 1 }}>
                    <Field
                      value={selectedTicketId === ticket.id ? replyText : ''}
                      onChangeText={t => {
                        setSelectedTicketId(ticket.id);
                        setReplyText(t);
                      }}
                      placeholder="أضف ردًا..."
                    />
                  </View>
                  <Button
                    label="إرسال"
                    secondary
                    onPress={() => handleSendReply(ticket.id)}
                    style={{ minHeight: 49 }}
                  />
                </View>
              </View>
            ))}
          </View>
        )}
      </Page>
    </ModalSheet>
  );
};
