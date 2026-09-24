import React from 'react';
import { View } from 'react-native';
import { ModalSheet } from '../components/common/ModalSheet';
import { Page, Txt, s, C } from '../components/common/UI';

export const TermsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const sections = [
    {
      title: '1. قبول الشروط',
      content:
        'باستخدامك لمنصة وتطبيق ADIX، فإنك تقر وتوافق على الالتزام بكافة الشروط والأحكام الواردة هنا، وتتحمل المسؤولية الكاملة عن أي استخدام لحسابك.',
    },
    {
      title: '2. طبيعة الخدمات الرقمية',
      content:
        'يقدم متجر ADIX خدمات شحن الألعاب، شراء البطاقات الرقمية، واشتراكات التطبيقات، بالإضافة إلى خدمات التسويق الرقمي وتفاعل منصات التواصل الاجتماعي (SMM). يتم تقديم كافة الخدمات رقمياً وفق المعايير المعتمدة.',
    },
    {
      title: '3. صحة البيانات والمسؤولية',
      content:
        'يتحمل المستخدم المسؤولية الكاملة عن صحة البيانات المدخلة، مثل معرّف اللاعب (Player ID) ورابط الحساب العام. لا تتحمل منصة ADIX أي مسؤولية عن أخطاء إدخال البيانات الناتجة عن المستخدم.',
    },
    {
      title: '4. خدمات منصات التواصل الاجتماعي (SMM)',
      content:
        'يجب أن يكون الحساب المستهدف عاماً (Public) طوال فترة تنفيذ الخدمة. نحن لا نطلب كلمات مرور حساباتك نهائياً. لا نضمن التفاعل العضوي الدائم بنسبة 100% نظراً لتحديثات خوارزميات المنصات المستمرة.',
    },
    {
      title: '5. المدفوعات والمحفظة',
      content:
        'تتم معالجة المدفوعات عبر شام كاش أو رصيد محفظة ADIX. عند تحويل الأموال يلتزم العميل بإرفاق إشعار تحويل واضح وصحيح ليتم التحقق منه من قبل فريق التدقيق.',
    },
  ];

  return (
    <ModalSheet title="الشروط والأحكام" subtitle="شروط استخدام منصة ADIX" navigation={navigation}>
      <Page style={{ padding: 24 }}>
        <Txt style={{ color: C.muted, fontSize: 13, lineHeight: 22, marginBottom: 18 }}>
          يرجى قراءة هذه الشروط بعناية قبل استخدام المتجر أو إنشاء أي طلب رقمي.
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
