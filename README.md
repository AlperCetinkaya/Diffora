# Diffora — Developer Toolkit

[Türkçe](README.md) | [English](README.en.md)

İki metin veya kod dosyasını yan yana karşılaştıran ve JSON/XML servis cevaplarını incelemeyi sağlayan, tarayıcı içinde çalışan bir web uygulaması. Aynı satırlar yeşil, farklı satırlar kırmızı gösterilir. Eklenen ve silinen satırlar için karşı tarafta boş alan bırakılarak hizalama korunur.

## Araçlar ve gezinme

Diffora, ortak bir sol menü altında üç bağımsız araç sunar:

- [Karşılaştırma](https://alpercetinkaya.com.tr/diffora/compare/)
- [JSON / XML Viewer](https://alpercetinkaya.com.tr/diffora/viewer/)
- [URL / Base64 Encode–Decode](https://alpercetinkaya.com.tr/diffora/codec/)

Masaüstünde sol menü, küçük ekranlarda üst araç menüsü kullanılır. Araçlar arasında geçiş, tarayıcının geri/ileri düğmeleri ve dil seçimi girdileri korur. Eski `#viewer` bağlantıları yeni Viewer adresine geçirilir. Ana adres varsayılan olarak Karşılaştırma aracını açar.

GitHub Pages üzerinde doğrudan bağlantılar için `dist/compare/index.html`, `dist/viewer/index.html` ve `dist/codec/index.html` giriş dosyaları depoda tutulur. Ana `dist/index.html` değiştirildiğinde bu dosyaları güncellemek için:

```bash
npm run build
```

Bu komut yalnızca üç statik giriş sayfasını üretir; sunucu veya veritabanı gerektirmez. `npm test` çalıştırıldığında da giriş sayfaları otomatik güncellenir.

## URL / Base64 Encode–Decode

[Canlı araç](https://alpercetinkaya.com.tr/diffora/codec/) UTF-8 metni yerel olarak kodlar ve çözer. URL bileşeni/parametre modu, tam URL modu, form/query (`+` boşluk) seçeneği, standart ve URL-safe Base64 desteklenir. Base64 çözmede satır sonları ve boşluklar yok sayılır; padding varsa doğrulanır, doğru padding'siz girdiler de kabul edilir.

Metin yapıştırabilir veya dosya yükleyebilirsiniz. Sonuç kopyalanabilir, indirilebilir veya ters işlem için girdiye taşınabilir. Girdi ve seçenekler değiştiğinde önceki çıktı temizlenir. Girdi sınırı 2 MB'dır. Base64 bir şifreleme yöntemi değildir; ikili veriler UTF-8 metin gibi gösterilmez, hata olarak bildirilir. İçerik tarayıcıda işlenir ve sunucuya gönderilmez.

URL bileşeni modu ayrılmış karakterleri kodlar; tam URL modu `: / ? & = #` ayraçlarını korur. Tam URL çözümü, URL yapısını korumak için `%2F` gibi kodlanmış ayrılmış karakterleri çözmez.

## JSON / XML Viewer

[Canlı Viewer](https://alpercetinkaya.com.tr/diffora/viewer/) sekmesinde servis cevabını yapıştırın veya UTF-8 dosya yükleyin. **Formatla ve doğrula** ile JSON/XML otomatik tanınır; biçimi elle de seçebilirsiniz.

- İç içe nesneler, diziler ve XML etiketleri için açılıp kapanan ağaç görünümü
- Renklendirilmiş, satır numaralı kod görünümü; 2 veya 4 boşluk girinti
- Biçim hatası açıklaması ve ayrıştırıcı sağladığında satır/sütun konumu; **Hataya git**
- Alan/değer arama ve eşleşmeler arasında gezinme
- Girintili/sıkıştırılmış çıktı, kopyalama ve `.json` / `.xml` indirme
- JSON string'i içinde taşınan JSON/XML'i açık bir kullanıcı eylemiyle açma
- Büyük JSON sayıları, yinelenen anahtarlar ve sayı yazımları formatlama sırasında korunur
- XML karışık metin, CDATA ve `xml:space` içeriklerinin anlamlı boşlukları korunur
- Türkçe, İngilizce ve Almanca arayüz; sekme değişiminde girdiler korunur

Kaynak metin biçim hatasında otomatik düzeltilmez. Viewer en fazla 2 MB içerik kabul eder. DTD/DOCTYPE desteklenmez; en fazla 512 iç içe seviye ayrıştırılır. Ağaç görünümü 8.000 düğüm / 120 seviye ile sınırlıdır; tam içerik kod görünümünde, kopyalamada ve indirmede korunur. XML şema/XSD doğrulaması yapılmaz.

## Özellikler

- Dosya seçme, sürükleyip bırakma veya doğrudan metin yapıştırma
- Satır numaralarıyla yan yana karşılaştırma
- Değişen satırlarda ortak başlangıç ve bitiş arasındaki bölümün vurgulanması
- Aynı, değişen, eklenen ve silinen satır sayıları
- Yalnızca farkları gösterme
- Önceki ve sonraki değişiklik grubuna gitme
- Boşluk farklarını yok sayma
- Dosyaların yerini değiştirme ve içerikleri temizleme
- Türkçe, İngilizce ve Almanca arayüz; dil tercihini hatırlama
- Lacivert vurgulara sahip koyu tema ve mobil uyumlu düzen
- Hazır örnek ve `Ctrl+Enter` / `⌘+Enter` ile karşılaştırma

## Yerel çalıştırma

Derleme, npm kurulumu, API anahtarı veya veritabanı gerekmez. Güncel bir tarayıcı ve aşağıdaki örnek için Python 3 yeterlidir.

```bash
git clone https://github.com/AlperCetinkaya/Diffora.git
cd Diffora
python3 -m http.server 3000 --directory dist
```

Tarayıcıda **http://localhost:3000** adresini açın. Windows üzerinde Python komutu `python` veya `py` olabilir.

Depo özel ise klonlamak için GitHub hesabınızla kimlik doğrulamanız gerekir.

## Kullanım

1. Sol panele ilk dosyayı, sağ panele güncel dosyayı ekleyin veya metinlerini yapıştırın.
2. Gerekirse **Boşluk farklarını yok say** seçeneğini etkinleştirin.
3. **Dosyaları karşılaştır** düğmesine basın.
4. Yeşil eşleşmeleri ve kırmızı farkları inceleyin. Çizgili hücre, o tarafta karşılık gelen bir satır olmadığını belirtir.
5. **Yalnızca farklar** seçeneğiyle eşleşen satırları gizleyin; oklarla değişiklik grupları arasında gezinin.

Sağ üstteki menüden arayüz dilini değiştirebilirsiniz. Bu işlem dosya içeriklerini çevirmez veya değiştirmez.

## Gizlilik

Dosya içeriği tarayıcıda okunur ve karşılaştırılır; uygulama tarafından sunucuya gönderilmez. Metinler uygulama tarafından kalıcı depolamaya kaydedilmez. Yalnızca dil tercihi tarayıcının `localStorage` alanında saklanır.

Yazı tipleri Google Fonts üzerinden yüklenir; bu nedenle ilk açılışta harici bir yazı tipi isteği yapılabilir. Font yüklenemezse sistem yazı tipleri kullanılır.

## Teknoloji ve proje yapısı

Uygulama HTML, CSS ve vanilla JavaScript ile geliştirilmiştir. Çalışma zamanı JavaScript kütüphanesi veya sunucu uygulaması kullanmaz.

```text
diffora/
├── README.md       # Türkçe dokümantasyon
├── README.en.md    # İngilizce dokümantasyon
├── .gitignore
└── dist/
    ├── index.html   # Sayfa ve arayüz iskeleti
    ├── style.css    # Tema, karşılaştırma renkleri ve responsive düzen
    ├── diff.js      # Satır eşleştirme ve hizalama algoritması
    ├── viewer-core.js # JSON/XML ayrıştırma ve formatlama
    ├── viewer.js      # Viewer sekmesi ve etkileşimleri
    ├── viewer.css     # Viewer düzeni ve tema
    ├── i18n.js      # TR / EN / DE çevirileri ve dil tercihi
    └── app.js       # Dosya okuma, karşılaştırma görünümü ve etkileşimler
```

`dist/` klasörü doğrudan düzenlenebilen uygulama kaynaklarını içerir; bir derleme adımıyla üretilmez.

Karşılaştırma ortak başlangıç ve bitiş satırlarını ayırır. Küçük bölümlerde en uzun ortak alt dizi (LCS), büyük bölümlerde ise seyrek değişiklikleri verimli işleyen, işlem ve bellek sınırları olan Myers yaklaşımı kullanılır. Ardışık silme ve eklemeler yan yana satırlara dönüştürülür. Çekirdek algoritma CRLF ve CR satır sonlarını LF olarak normalize eder.

## Sınırlar

- Dosya seçme ve sürükleyip bırakmada dosya başına en fazla **2 MB** kabul edilir. Yapıştırılan metin için aynı dosya boyutu kontrolü uygulanmaz.
- Dosyalar UTF-8 metin olarak okunur. NUL karakteri içeren ikili dosyalar reddedilir. PDF, Word ve görsel dosyalarının içeriğini çıkartmaz.
- Ortak başlangıç ve bitiş çıkarıldıktan sonra `(n + 1) × (m + 1)` matrisi **12 milyon hücreyi** aşarsa büyük dosya algoritmasına geçilir. Bu algoritmada arama adımları ve saklanan iz hücreleri ayrı ayrı 12 milyonla sınırlıdır. Çok farklı büyük dosyalar işlem sınırına takılabilir; bu durumda sonuçlar temizlenir ve daha küçük bölümler karşılaştırılmalıdır.
- Boşlukları yok sayma seçeneği, satır içindeki tüm boşluk karakterlerini karşılaştırmadan çıkarır; kodun anlamını analiz etmez.
- Bu sürüm metin karşılaştırmaya yöneliktir. Git conflict çözme, dosya birleştirme, sözdizimi renklendirme ve düzenlenen dosyayı dışa aktarma özellikleri bulunmaz.

## Doğrulama

JavaScript sözdizimini Node.js ile kontrol edebilirsiniz:

```bash
node --check dist/app.js
node --check dist/diff.js
node --check dist/i18n.js
```

Bu komutlar tarayıcı testi yerine geçmez. Arayüz kontrolünde örneği yükleyin, bir satır ekleyip silin, aynı ve boş içerikleri karşılaştırın; dil değiştirirken metinlerin ve sonucun korunduğunu kontrol edin.

## Yayınlama

Herhangi bir statik web sunucusunda **`dist/` klasörünü** yayınlayın. Derleme komutu gerekmez. GitHub deposuna yüklemek, tek başına GitHub Pages yayınını etkinleştirmez.

## Regresyon testleri

Node.js ile ek bağımlılık kurmadan çalıştırın:

```bash
node tests/long-documents.cjs
node tests/regressions.cjs
```

Viewer testleri dahil tam paket için Node.js 24.15+ (24.x) kullanın:

```bash
npm ci
npm test
```

`jsdom` yalnızca geliştirme/test bağımlılığıdır. Yayındaki uygulama için npm veya sunucu kurulumu gerekmez.

Testler uzun dosyalar, dağınık değişiklikler, kapasite hatası sonrası durum, farklar arasında gezinme ve yok sayılan boşluk vurgularını kapsar. İlk komut `fixtures/` altında örnek TXT dosyalarını ve `results.json` dosyasını üretir. DOM durum testleri bir test modeli kullanır; gerçek tarayıcı testinin yerine geçmez.
