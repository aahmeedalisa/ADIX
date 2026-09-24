import React from 'react';
import { View } from 'react-native';
import { ModalSheet } from '../components/common/ModalSheet';
import { Page, Txt, s, C } from '../components/common/UI';

export const RefundScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const sections = [
    {
      title: '1. شروط استرجاع الأموال',
      content:
        'يحق للعميل استرجاع كامل المبلغ في حال تعذر تنفيذ الخدمة أو عدم توفر المنتج الرقمي المطلوب، أو في حال تم رفض الطلب من قبل الإدارة.',
    },
    {
      title: '2. الاسترجاع إلى محفظة ADIX',
      content:
        'في حال إلغاء أي طلب تم دفعه عبر رصيد المحفظة، يعود المبلغ مباشرة وفوراً إلى رصيد محفظتك الرقمية دون أي خصومات أو رسوم.',
    },
    {
      title: '3. الحالات المستثناة من الاسترجاع',
      content:
        'لا يمكن إلغاء أو استرجاع قيمة الطلبات التي دخلت حالة "مكتمل" وتم إرسال الشحن لمعرّف اللاعب بنجاح، أو الحسابات التي أُدخلت بروابط غير صحيحة من قبل العميل.',
    },
    {
      title: '4. مدة معالجة طلبات الاسترجاع',
      content:
        'تتم معالجة أي طلب استرجاع ومراجعته عبر الدعم الفني خلال مدة أقصاها 24 ساعة من تاريخ تقديم التذكرة.',
    },
  ];

  return (
    <ModalSheet title="سياسة الاسترجاع والإلغاء" subtitle="حقوقك مضمونة في ADIX" navigation={navigation}>
      <Page style={{ padding: 24 }}>
        <Txt style={{ color: C.muted, fontSize: 13, lineHeight: 22, marginBottom: 18 }}>
          نلتزم بضمان حقوق عملائنا وتوفير سياسة استرجاع عادلة وواضحة لكافة المعاملات.
        </Txt>

        {sections.map(sec => (
          <View key={sec.title} style={[s.panel, { marginBottom: 14 }]}>
            <Txt bold style={{ fontSize: 15, marginBottom: 8 }}>{sec.title}</Txt>
            <Txt style={{ color: '#BBB', fontSize: 12, lineHeight: 21 }}>{sec.content}</Txt>
          </View>
        ))}
      </Page>
    </ModalSheet>
  );
};
