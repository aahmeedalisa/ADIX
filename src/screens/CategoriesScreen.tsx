import React, { useState, useEffect } from 'react';
import { View, FlatList, TextInput, Pressable, useWindowDimensions } from 'react-native';
import { products, filters, isSocial } from '../constants/catalog';
import { Page, Title, ProductCard, Icon, Txt, Empty, s, C } from '../components/common/UI';

export const CategoriesScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const [selectedCat, setSelectedCat] = useState<string>(route.params?.category || 'all');
  const [searchQuery, setSearchQuery] = useState<string>(route.params?.query || '');
  const [refreshing, setRefreshing] = useState(false);
  const { width } = useWindowDimensions();

  const numCols = width > 1200 ? 4 : width > 750 ? 3 : 2;

  useEffect(() => {
    if (route.params?.category) {
      setSelectedCat(route.params.category);
    }
    if (route.params?.query !== undefined) {
      setSearchQuery(route.params.query);
    }
  }, [route.params]);

  const filteredProducts = products.filter(p => {
    const matchCat =
      selectedCat === 'all' ||
      (selectedCat === 'social' && isSocial(p.category)) ||
      p.category === selectedCat;
    const matchSearch = `${p.name} ${p.subtitle}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <FlatList
      key={numCols}
      data={filteredProducts}
      numColumns={numCols}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: width < 650 ? 18 : 30, paddingBottom: 50 }}
      columnWrapperStyle={{ flexDirection: 'row-reverse', gap: 14, marginBottom: 16 }}
      refreshing={refreshing}
      onRefresh={() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 500);
      }}
      ListHeaderComponent={
        <>
          <Title
            title="عالم من الخدمات الرقمية"
            subtitle="من لعبتك المفضلة إلى حضورك الرقمي، كل شيء هنا."
          />

          {/* Search Box */}
          <View style={[s.input, s.row, { paddingVertical: 0, marginBottom: 20 }]}>
            <Icon name="search-outline" size={19} color="#777" />
            <TextInput
              accessibilityLabel="البحث في الخدمات"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="ابحث عن لعبة، تطبيق، أو خدمة..."
              placeholderTextColor="#666"
              returnKeyType="search"
              style={{
                flex: 1,
                fontFamily: 'Tajawal',
                color: 'white',
                fontSize: 14,
                textAlign: 'right',
                height: 48,
              }}
            />
            {Boolean(searchQuery) && (
              <Pressable onPress={() => setSearchQuery('')}>
                <Icon name="close" size={18} color="#999" />
              </Pressable>
            )}
          </View>

          {/* Filter Chips */}
          <View style={[s.row, { flexWrap: 'wrap', gap: 9, marginBottom: 22 }]}>
            {filters.map(f => (
              <Pressable
                key={f.id}
                onPress={() => setSelectedCat(f.id)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                  backgroundColor: selectedCat === f.id ? '#FFF' : '#171717',
                  borderColor: selectedCat === f.id ? '#FFF' : '#303030',
                  borderWidth: 1,
                }}
              >
                <Txt
                  bold
                  style={{
                    fontSize: 12,
                    color: selectedCat === f.id ? '#111' : '#AAA',
                  }}
                >
                  {f.name}
                </Txt>
              </Pressable>
            ))}
          </View>

          <View style={[s.row, { justifyContent: 'space-between', marginBottom: 16 }]}>
            <Txt bold style={{ fontSize: 17 }}>
              {filters.find(f => f.id === selectedCat)?.name || 'الخدمات'}
            </Txt>
            <Txt style={{ fontSize: 12, color: '#888' }}>
              {`${filteredProducts.length} خدمة متاحة`}
            </Txt>
          </View>
        </>
      }
      renderItem={({ item }) => (
        <View style={{ width: `${(100 - (numCols - 1) * 2) / numCols}%`, flex: 1 / numCols }}>
          <ProductCard product={item} onPress={() => navigation.navigate('Service', { id: item.id })} />
        </View>
      )}
      ListEmptyComponent={
        <Empty
          icon="search-outline"
          title="لم نجد نتائج مطابقة"
          body="جرّب البحث بكلمات أخرى أو اختر قسماً آخر."
          action="عرض كل الخدمات"
          onAction={() => {
            setSearchQuery('');
            setSelectedCat('all');
          }}
        />
      }
      ListFooterComponent={
        <Txt style={{ color: '#626262', fontSize: 11, textAlign: 'center', marginTop: 24 }}>
          الأسعار والباقات المعروضة محدثة وتعتمد التحقق المباشر بعد الطلب.
        </Txt>
      }
    />
  );
};
