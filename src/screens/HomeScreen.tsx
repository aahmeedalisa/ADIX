import React, { useState } from 'react';
import { View, Pressable, useWindowDimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../context/StoreContext';
import { categories, products, money } from '../constants/catalog';
import { DeveloperSection } from '../components/developer/DeveloperSection';
import { Page, Title, ProductCard, Icon, Txt, Button, s, C } from '../components/common/UI';

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { state, showToast } = useStore();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1050;
  const isMobile = width < 650;
  const [refreshing, setRefreshing] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [hideBalance, setHideBalance] = useState(false);

  const heroSlides = [
    {
      title: 'اشحن. انطلق.\nخلّك في المقدّمة.',
      description: 'ألعابك، تطبيقاتك، وحضورك الرقمي.\nكل ما تحتاجه في مكان واحد، بخطوات موثوقة وفورية.',
      action: 'استكشف الخدمات',
      category: 'all',
    },
    {
      title: 'كل لعبة.\nمغامرة بمستوى أعلى.',
      description: 'شدّات، نقاط، وبطاقات رقمية معتمدة.\nاستعدّ للمستوى التالي مع أديكس.',
      action: 'اكتشف الألعاب',
      category: 'games',
    },
    {
      title: 'حضورك الرقمي.\nيستحق وصولًا استثنائيًا.',
      description: 'متابعون، مشاهدات وتفاعل لمنصاتك المفضلة.\nخطوتك نحو التميّز والترند.',
      action: 'خدمات السوشيال',
      category: 'social',
    },
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      showToast('أنت مطّلع على أحدث العروض والخدمات');
    }, 600);
  };

  const navToCategory = (cat: string) => {
    navigation.navigate('Main', { screen: 'Categories', params: { category: cat, query: '' } });
  };

  return (
    <Page
      style={{ padding: isMobile ? 18 : 30, paddingTop: isMobile ? 20 : 26 }}
      refreshing={refreshing}
      onRefresh={handleRefresh}
    >
      {/* 1. Developer Section at Top (if enabled) */}
      <DeveloperSection place="home" position="top" />

      {/* Header Greeting */}
      <View style={[s.row, { justifyContent: 'space-between', marginBottom: 22 }]}>
        <View>
          <View style={[s.row, { gap: 6 }]}>
            <Txt bold style={{ fontSize: isMobile ? 22 : 26, lineHeight: 36 }}>
              {state.signedIn ? `أهلًا بك، ${state.user?.name.split(' ')[0]}` : 'أهلًا بك في أديكس'}
            </Txt>
            <Txt style={{ fontSize: 20 }}>✦</Txt>
          </View>
          <Txt style={{ fontSize: 13, color: C.muted }}>عالمك الرقمي، أقرب إليك من أي وقت.</Txt>
        </View>

        {!isMobile && (
          <View style={styles.onlineBadge}>
            <View style={styles.onlineDot} />
            <Txt style={{ color: '#aaa', fontSize: 11 }}>كل الأنظمة تعمل بنجاح</Txt>
          </View>
        )}
      </View>

      {/* Hero & Quick Wallet Row */}
      <View style={[styles.heroRow, !isDesktop && { flexDirection: 'column' }]}>
        {/* Hero Card */}
        <View style={[styles.hero, !isDesktop && { width: '100%' }, isMobile && { minHeight: 380 }]}>
          <LinearGradient
            colors={['#242424', '#151515', '#0E0E0E']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={[styles.heroCopy, isMobile && { width: '100%', padding: 22 }]}>
            <View style={styles.eyebrow}>
              <Icon name="sparkles" size={11} color="#FFF" />
              <Txt style={{ fontSize: 10, color: '#DDD', letterSpacing: 0.5 }}>
                تجربة رقمية، بمعايير احترافية
              </Txt>
            </View>

            <Txt bold style={[styles.heroTitle, isMobile && { fontSize: 28, lineHeight: 38 }]}>
              {heroSlides[heroIndex].title}
            </Txt>
            <Txt style={styles.heroSub}>{heroSlides[heroIndex].description}</Txt>

            <View style={[s.row, { marginTop: 22, gap: 10 }]}>
              <Button
                label={heroSlides[heroIndex].action}
                icon="arrow-back"
                onPress={() => navToCategory(heroSlides[heroIndex].category)}
                style={{ minHeight: 42, paddingHorizontal: 17 }}
              />
              <Pressable
                onPress={() => navigation.navigate('Coupons')}
                style={[s.row, { gap: 6, padding: 6 }]}
              >
                <Txt style={{ fontSize: 12, color: '#C4C4C4' }}>شاهد العروض</Txt>
                <Icon name="arrow-back" size={14} color="#C4C4C4" />
              </Pressable>
            </View>
          </View>

          {/* Dots */}
          <View style={styles.heroDots}>
            {heroSlides.map((_, idx) => (
              <Pressable key={idx} onPress={() => setHeroIndex(idx)} hitSlop={10}>
                <View style={heroIndex === idx ? styles.activeDot : styles.inactiveDot} />
              </Pressable>
            ))}
          </View>
          <Txt style={styles.heroIndex}>{`0${heroIndex + 1} / 03`}</Txt>
        </View>

        {/* Quick Wallet Widget */}
        <View
          style={[
            styles.wallet,
            !isDesktop && {
              width: '100%',
              flexDirection: isMobile ? 'column' : 'row-reverse',
              alignItems: isMobile ? 'stretch' : 'center',
              gap: 20,
            },
            isMobile && { padding: 20 },
          ]}
        >
          <View style={isDesktop || isMobile ? undefined : { flex: 1 }}>
            <View style={[s.row, { justifyContent: 'space-between' }]}>
              <View style={[s.row, { gap: 8 }]}>
                <Icon name="wallet-outline" size={18} color="#BBB" />
                <Txt bold style={{ fontSize: 14 }}>محفظتي</Txt>
              </View>
              <View style={styles.usdBadge}>
                <Txt style={{ fontSize: 9, color: '#AAA' }}>USD</Txt>
              </View>
            </View>

            <Txt style={{ color: '#777', fontSize: 11, marginTop: 18 }}>الرصيد المتاح</Txt>
            <View style={[s.row, { gap: 8, marginTop: 4, alignItems: 'baseline' }]}>
              <Txt bold style={{ fontSize: 36, lineHeight: 46, letterSpacing: -1 }}>
                {hideBalance ? '••••' : money(state.balance)}
              </Txt>
              <Pressable onPress={() => setHideBalance(!hideBalance)} hitSlop={10}>
                <Icon name={hideBalance ? 'eye-off-outline' : 'eye-outline'} color="#777" size={16} />
              </Pressable>
            </View>

            <View style={[s.row, { gap: 5, marginTop: 4 }]}>
              <View style={styles.secureDot} />
              <Txt style={{ fontSize: 10, color: '#8C8C8C' }}>رصيدك آمن وجاهز للاستخدام</Txt>
            </View>
          </View>

          <View style={isDesktop || isMobile ? undefined : { flex: 1 }}>
            <Button
              label="إضافة رصيد"
              icon="add"
              onPress={() => navigation.navigate('Payment', { deposit: true })}
              style={{ marginTop: isDesktop || isMobile ? 16 : 0, minHeight: 40 }}
            />
            <View style={[s.line, { marginVertical: 12 }]} />
            <Pressable
              onPress={() => navigation.navigate('Main', { screen: 'Orders' })}
              style={[s.row, { justifyContent: 'space-between' }]}
            >
              <View style={[s.row, { gap: 6 }]}>
                <Icon name="receipt-outline" color="#8D8D8D" size={15} />
                <Txt style={{ fontSize: 11, color: '#AAA' }}>طلبات قيد المتابعة</Txt>
              </View>
              <View style={[s.row, { gap: 6 }]}>
                <Txt bold style={{ fontSize: 13 }}>
                  {state.orders.filter(o => o.status === 'processing' || o.status === 'review').length}
                </Txt>
                <Icon name="chevron-back" size={12} color="#777" />
              </View>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Trust Badges */}
      <View style={[styles.trustRow, isMobile && { flexWrap: 'wrap', gap: 12 }]}>
        {[
          { icon: 'flash-outline', title: 'تنفيذ فوري', sub: 'وقتك يهمّنا' },
          { icon: 'shield-checkmark-outline', title: 'دفع آمن ومحمي', sub: 'حماية لكل عملية' },
          { icon: 'headset-outline', title: 'دعم فني 24/7', sub: 'نحن هنا من أجلك' },
          { icon: 'pricetag-outline', title: 'أفضل الأسعار', sub: 'قيمة تستحقها' },
        ].map((item, idx) => (
          <View
            key={item.title}
            style={[
              styles.trustItem,
              idx > 0 && !isMobile && styles.trustBorder,
              isMobile && { width: '47%', flex: undefined },
            ]}
          >
            <Icon name={item.icon} size={22} color="#A0A0A0" />
            <View>
              <Txt bold style={{ fontSize: 12, lineHeight: 18 }}>{item.title}</Txt>
              <Txt style={{ color: '#707070', fontSize: 10 }}>{item.sub}</Txt>
            </View>
          </View>
        ))}
      </View>

      {/* Categories Horizontal */}
      <View style={{ marginTop: 28 }}>
        <Title
          title="اكتشف الأقسام"
          subtitle="اختر ما يناسبك، وتتبّع طلبك بسهولة"
          action="عرض جميع الأقسام"
          onAction={() => navToCategory('all')}
        />
        <View style={[styles.categoryRow, isMobile && { flexWrap: 'wrap', gap: 10 }]}>
          {categories.map(cat => (
            <Pressable
              key={cat.id}
              accessibilityRole="button"
              onPress={() => navToCategory(cat.id)}
              style={({ hovered, pressed }: any) => [
                styles.categoryCard,
                isMobile && { flex: undefined, width: '31%' },
                hovered && { backgroundColor: '#222', borderColor: '#666' },
                pressed && { opacity: 0.7 },
              ]}
            >
              <View style={styles.categoryIconWrap}>
                <Icon name={cat.icon} size={26} color="#DDD" />
              </View>
              <Txt bold style={{ fontSize: isMobile ? 11 : 12, textAlign: 'center', marginTop: 10 }}>
                {cat.name}
              </Txt>
              <Txt style={{ fontSize: 9, color: '#707070', textAlign: 'center', marginTop: 2 }}>
                {cat.sub}
              </Txt>
            </Pressable>
          ))}
        </View>
      </View>

      {/* 2. Developer Section: Before Services */}
      <DeveloperSection place="home" position="beforeServices" />

      {/* Featured Services */}
      <View style={{ marginTop: 30 }}>
        <Title
          title="الأكثر طلبًا"
          subtitle="اختيارات يثق بها عملاء أديكس"
          action="عرض كل الخدمات"
          onAction={() => navToCategory('games')}
        />
        <View style={[styles.productGrid, isMobile && { flexWrap: 'wrap', gap: 12 }]}>
          {products.slice(0, 4).map(prod => (
            <View key={prod.id} style={{ flex: isMobile ? undefined : 1, width: isMobile ? '48%' : undefined }}>
              <ProductCard
                product={prod}
                onPress={() => navigation.navigate('Service', { id: prod.id })}
              />
            </View>
          ))}
        </View>
      </View>

      {/* 3. Developer Section: After Services */}
      <DeveloperSection place="home" position="afterServices" />

      {/* Offer Promo Banner */}
      <View style={styles.offerBanner}>
        <LinearGradient
          colors={['#242424', '#151515']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={[s.row, { flex: 1 }]}>
          <View style={styles.offerIcon}>
            <Icon name="gift-outline" size={26} color="#FFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Txt bold style={{ fontSize: 16 }}>أول تجربة لك؟ اجعلها مميّزة.</Txt>
            <Txt style={{ color: '#939393', fontSize: 11 }}>
              خصم 10% على طلبك الأول باستخدام الكود ADIX10
            </Txt>
          </View>
        </View>
        <Pressable onPress={() => navigation.navigate('Coupons')} style={styles.couponPill}>
          <Txt bold style={{ fontSize: 12, letterSpacing: 1.5 }}>ADIX10</Txt>
          <Icon name="copy-outline" size={16} color="#AAA" />
        </Pressable>
      </View>

      {/* SMM Social Platforms Section */}
      <View style={{ marginTop: 30 }}>
        <Title
          title="عزّز حضورك الرقمي"
          subtitle="متابعون وتفاعل حقيقي لجميع منصاتك"
          action="خدمات السوشيال"
          onAction={() => navToCategory('social')}
        />
        <View style={[styles.socialRow, isMobile && { flexWrap: 'wrap' }]}>
          {[
            { id: 'instagram', name: 'Instagram', icon: 'logo-instagram' },
            { id: 'tiktok', name: 'TikTok', icon: 'logo-tiktok' },
            { id: 'youtube', name: 'YouTube', icon: 'logo-youtube' },
            { id: 'facebook', name: 'Facebook', icon: 'logo-facebook' },
            { id: 'x', name: 'X', icon: 'close' },
          ].map(item => (
            <Pressable
              key={item.id}
              onPress={() => navToCategory(item.id)}
              style={({ hovered }: any) => [
                styles.socialBtn,
                hovered && { backgroundColor: '#242424' },
                isMobile && { minWidth: '29%' },
              ]}
            >
              <Icon name={item.icon} size={24} color="#DDD" />
              <Txt bold style={{ fontSize: 12 }}>{item.name}</Txt>
              <Icon name="arrow-back" color="#666" size={14} />
            </Pressable>
          ))}
        </View>
      </View>

      {/* 4. Developer Section: Before Footer */}
      <DeveloperSection place="home" position="beforeFooter" />

      {/* Footer */}
      <View style={styles.footerWrap} testID="home-footer">
        <View style={styles.footer}>
          <Txt style={{ color: '#565656', fontSize: 11 }}>
            © 2026 ADIX. كل الحقوق محفوظة.
          </Txt>
          <View style={[s.row, { gap: 14, flexWrap: 'wrap' }]}>
            <Pressable onPress={() => navigation.navigate('About')}>
              <Txt style={{ color: '#888', fontSize: 11 }}>من نحن</Txt>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Support')}>
              <Txt style={{ color: '#888', fontSize: 11 }}>الدعم الفني</Txt>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Terms')}>
              <Txt style={{ color: '#888', fontSize: 11 }}>الشروط</Txt>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Privacy')}>
              <Txt style={{ color: '#888', fontSize: 11 }}>الخصوصية</Txt>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Refund')}>
              <Txt style={{ color: '#888', fontSize: 11 }}>الاسترجاع</Txt>
            </Pressable>
          </View>
        </View>

        {/* 5. Developer Section: Inside Footer */}
        <DeveloperSection place="footer" />
      </View>
    </Page>
  );
};

const styles = StyleSheet.create({
  onlineBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 7,
    borderWidth: 1,
    borderColor: '#252525',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  onlineDot: {
    backgroundColor: '#8b9c8f',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  heroRow: {
    flexDirection: 'row-reverse',
    gap: 18,
  },
  hero: {
    flex: 1,
    minHeight: 280,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#363636',
    overflow: 'hidden',
    position: 'relative',
  },
  heroCopy: {
    width: '75%',
    alignSelf: 'flex-end',
    padding: 24,
    zIndex: 2,
  },
  eyebrow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 7,
    alignSelf: 'flex-end',
    borderColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 20,
    paddingRight: 8,
    paddingLeft: 12,
    paddingVertical: 3,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  heroSub: {
    color: '#9C9C9C',
    fontSize: 12,
    lineHeight: 20,
    marginTop: 8,
  },
  heroDots: {
    position: 'absolute',
    left: '48%',
    bottom: 14,
    flexDirection: 'row-reverse',
    gap: 5,
  },
  activeDot: {
    height: 4,
    width: 18,
    borderRadius: 2,
    backgroundColor: '#DDD',
  },
  inactiveDot: {
    height: 4,
    width: 4,
    borderRadius: 2,
    backgroundColor: '#555',
  },
  heroIndex: {
    position: 'absolute',
    left: 18,
    bottom: 12,
    fontSize: 10,
    letterSpacing: 1.5,
    color: '#777',
  },
  wallet: {
    width: 270,
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#303030',
    borderRadius: 16,
    padding: 20,
    justifyContent: 'space-between',
  },
  usdBadge: {
    backgroundColor: '#242424',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  secureDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#899a8d',
  },
  trustRow: {
    flexDirection: 'row-reverse',
    marginTop: 18,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#262626',
    gap: 12,
  },
  trustItem: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  trustBorder: {
    borderRightWidth: 1,
    borderRightColor: '#282828',
    paddingRight: 10,
  },
  categoryRow: {
    flexDirection: 'row-reverse',
    gap: 12,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  categoryIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#202020',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productGrid: {
    flexDirection: 'row-reverse',
    gap: 14,
  },
  offerBanner: {
    marginTop: 26,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#383838',
    padding: 18,
    overflow: 'hidden',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },
  offerIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#262626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  couponPill: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#222',
    borderWidth: 1,
    borderColor: '#444',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  socialRow: {
    flexDirection: 'row-reverse',
    gap: 10,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#171717',
    borderWidth: 1,
    borderColor: C.border,
    padding: 13,
    borderRadius: 10,
  },
  footerWrap: {
    marginTop: 35,
    borderTopWidth: 1,
    borderTopColor: '#222',
    paddingTop: 20,
    gap: 16,
  },
  footer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
});
