import React from 'react';
import { View } from 'react-native';
import { ModalSheet } from '../components/common/ModalSheet';
import { DeveloperSection } from '../components/developer/DeveloperSection';
import { Page, Icon, Txt, Button, s, C } from '../components/common/UI';

export const AboutScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <ModalSheet title="من نحن" subtitle="عالم ADIX الرقمي" navigation={navigation}>
      <Page style={{ padding: 26 }}>
        {/* Brand Header */}
        <View style={{ alignItems: 'center', paddingVertical: 20 }}>
          <Txt
            bold
            style={{
              fontSize: 54,
              lineHeight: 68,
              letterSpacing: -3,
              fontStyle: 'italic',
            }}
          >
            ADIX
          </Txt>
          <Txt style={{ color: '#999', fontSize: 11, letterSpacing: 2 }}>
            YOUR DIGITAL ADVANTAGE
          </Txt>
        </View>

        <Txt bold style={{ fontSize: 24, lineHeight: 36, marginBottom: 12 }}>
          عالمك الرقمي.{'\n'}بخطوات أبسط وبلا حدود.
        </Txt>
        <Txt style={{ color: '#AAA', lineHeight: 26, fontSize: 13 }}>
          ADIX منصة رقمية عربية رائدة متخصصة في شحن الألعاب والتطبيقات والبطاقات الرقمية وخدمات السوشيال ميديا لمختلف المنصات العالمية مثل Instagram وTikTok وYouTube وFacebook وX وغيرها. نركّز على السرعة الفائقة، الشفافية المطلقة، والأمان العالي لتوفير تجربة تسوق إلكتروني متكاملة وسلسة.
        </Txt>

        {/* Vision & Mission */}
        <View style={{ gap: 12, marginTop: 22, marginBottom: 22 }}>
          {[
            {
              icon: 'compass-outline',
              title: 'رؤيتنا',
              text: 'أن نكون المنصة الرقمية الأولى في الشرق الأوسط التي تجمع كل احتياجات اللاعبين وصنّاع المحتوى ورواد الأعمال الرقميين في واجهة عصرية وموثوقة.',
            },
            {
              icon: 'rocket-outline',
              title: 'مهمتنا',
              text: 'تبسيط عمليات الشحن الرقمي ودعم الحسابات بأعلى معايير الجودة والأمان، مع توفير دعم فني متواصل وحلول دفع مرنة وسريعة.',
            },
          ].map(item => (
            <View key={item.title} style={[s.panel, { gap: 10 }]}>
              <View style={s.row}>
                <Icon name={item.icon} size={22} color="#CCC" />
                <Txt bold style={{ fontSize: 18 }}>{item.title}</Txt>
              </View>
              <Txt style={{ fontSize: 12, color: C.muted, lineHeight: 22 }}>{item.text}</Txt>
            </View>
          ))}
        </View>

        {/* Why ADIX */}
        <Txt bold style={{ fontSize: 20, marginBottom: 14 }}>لماذا ADIX؟</Txt>
        <View style={{ gap: 10, marginBottom: 22 }}>
          {[
            {
              icon: 'flash-outline',
              title: 'تنفيذ فوري وآمن',
              text: 'معالجة آلية ومراجعة دقيقة لضمان وصول شحنتك بأقصى سرعة ممكنة.',
            },
            {
              icon: 'shield-checkmark-outline',
              title: 'أمان وخصوصية تامة',
              text: 'لا نطلب كلمات مرور حساباتك مطلقاً. كل ما نحتاجه هو رابط حسابك العام أو معرّف اللاعب.',
            },
            {
              icon: 'wallet-outline',
              title: 'محفظة رقمية ذكية',
              text: 'إمكانية شحن رصيدك واستخدامه في أي وقت بنقرة واحدة وتتبع حركاتك المالية بدقة.',
            },
            {
              icon: 'headset-outline',
              title: 'دعم فني متخصص',
              text: 'فريق دعم متواجد على مدار 24 ساعة للرد على استفساراتك وحل أي مشكلة تواجهك.',
            },
          ].map(feat => (
            <View key={feat.title} style={[s.panel, s.row, { padding: 16 }]}>
              <Icon name={feat.icon} size={24} color="#DDD" />
              <View style={{ flex: 1 }}>
                <Txt bold style={{ fontSize: 13 }}>{feat.title}</Txt>
                <Txt style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>{feat.text}</Txt>
              </View>
            </View>
          ))}
        </View>

        {/* Embedded Developer Section in About */}
        <DeveloperSection place="about" />

        <Button
          secondary
          label="تواصل مع فريق الدعم"
          icon="headset-outline"
          onPress={() => navigation.navigate('Support')}
          style={{ marginTop: 20 }}
        />
      </Page>
    </ModalSheet>
  );
};
