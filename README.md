# Diffora — Developer Toolkit

[Türkçe](README.md) | [English](README.en.md)

İki metin veya kod dosyasını yan yana karşılaştıran ve JSON/XML servis cevaplarını incelemeyi sağlayan, tarayıcı içinde çalışan bir web uygulaması. Aynı satırlar yeşil, farklı satırlar kırmızı gösterilir. Eklenen ve silinen satırlar için karşı tarafta boş alan bırakılarak hizalama korunur.

## Araçlar ve gezinme

Diffora, ortak bir sol menü altında yedi bağımsız araç sunar:

- [Karşılaştırma](https://alpercetinkaya.com.tr/diffora/compare/)
- [JSON / XML Viewer](https://alpercetinkaya.com.tr/diffora/viewer/)
- [URL / Base64 Encode–Decode](https://alpercetinkaya.com.tr/diffora/codec/)
- [Timestamp Dönüştürücü](https://alpercetinkaya.com.tr/diffora/timestamp/)
- [Regex Tester](https://alpercetinkaya.com.tr/diffora/regex/)
- [JSON → C# Model](https://alpercetinkaya.com.tr/diffora/csharp/)
- [SQL Formatter](https://alpercetinkaya.com.tr/diffora/sql/)

Masaüstünde sol menü, küçük ekranlarda üst araç menüsü kullanılır. Araçlar arasında geçiş, tarayıcının geri/ileri düğmeleri ve dil seçimi girdileri korur. Eski `#viewer` bağlantıları yeni Viewer adresine geçirilir. Ana adres varsayılan olarak Karşılaştırma aracını açar.

GitHub Pages üzerinde doğrudan bağlantılar için `dist/compare/index.html`, `dist/viewer/index.html` `dist/codec/index.html` `dist/timestamp/index.html` `dist/regex/index.html` `dist/csharp/index.html` ve `dist/sql/index.html` giriş dosyaları depoda tutulur. Ana `dist/index.html` değiştirildiğinde bu dosyaları güncellemek için:

```bash
npm run build
```

Bu komut yalnızca yedi statik giriş sayfasını üretir; sunucu veya veritabanı gerektirmez. `npm test` çalıştırıldığında da giriş sayfaları otomatik güncellenir.

## SQL Formatter

[Canlı araç](https://alpercetinkaya.com.tr/diffora/sql/) PostgreSQL ve SQL Server (Transact-SQL) destekler. SQL türünü, 2/4 boşluk veya sekme girintisini, anahtar sözcüklerin büyük/küçük harf veya özgün biçimini seçin. SQL yapıştırabilir veya UTF-8 `.sql`/`.txt` dosyasını yükleyip/sürükleyip bırakabilirsiniz. Tam sonucu kopyalayın veya `.sql` indirin. Her SQL türünün ayrı örneği bulunur. Girdi/seçenek değişiklikleri eski çıktıyı temizler; araç ve dil geçişleri içeriği korur.

Testler PostgreSQL CTE, cast, `$1` parametreleri, JSON operatörleri, tırnaklı adlar ve dollar-quoted metinler ile T-SQL TOP, köşeli parantezli adlar, `@parametre`, Unicode metinler, transaction, sayfalama ve GO bloklarını (tekrar sayıları dahil) kapsar. Metin sabitleri, tırnaklı adlar ve yorum içerikleri korunur. Dollar-quoted fonksiyon gövdelerinin içi değiştirilmez. Bu araç SQL doğrulayıcısı veya çalıştırıcısı değildir. Stored procedure gövdeleri ve SQLCMD/psql komutları için tam destek yoktur. Veritabanı bağlantısı kurulmaz.

İşlemler tarayıcıdaki ayrı worker'da 3 saniye süre sınırıyla yapılır. Sınırlar: 512 KB UTF-8 girdi ve 2.097.152 karakter çıktı. Worker, SQL türü, içerik koruma, tekrar biçimlendirme, arayüz, dosya, pano ve indirme testleri `npm test` kapsamındadır. Türkçe, İngilizce ve Almanca desteklenir.

Yerel paketlenmiş motor **sql-formatter 15.10.0** (MIT) ve **nearley** çalışma zamanını (MIT) kullanır; yalnızca PostgreSQL/Transact-SQL kuralları pakete alınır. Lisanslar `dist/vendor/` altındadır. Çalışırken CDN kullanılmaz. `npm ci && npm run build`, sabitlenmiş esbuild sürümüyle SQL motorunu ve statik giriş sayfalarını yeniden üretir. Yalnızca SQL motoru için `npm run build:sql` kullanılabilir.

## JSON → C# Model

**JsonPropertyName attribute’larını ekle** seçeneği varsayılan olarak açıktır. Kapatıldığında hiçbir sınıfa bu attribute eklenmez. PascalCase adlar korunur; `created_at` gibi JSON adlarını eşlemek için serializer ayarlarını buna göre yapılandırın. Seçenek değiştiğinde modeli yeniden oluşturun.

[Canlı araç](https://alpercetinkaya.com.tr/diffora/csharp/) System.Text.Json uyumlu C# 10+ sınıfları üretir. UTF-8 JSON yapıştırın veya dosyadan yükleyin; ana sınıf adı ve isteğe bağlı namespace seçip modeli oluşturun. Kodu kopyalayabilir veya `.cs` olarak indirebilirsiniz. Viewer'da doğrulanmış JSON için **C# modeli oluştur** düğmesi bulunur; kaynağın tamamını aktarır ve Viewer içeriğini korur. XML, JSON olarak aktarılmaz.

İç içe nesneler ayrı sınıflara, diziler `List<T>` tipine dönüşür. Alan adları PascalCase yapılır; `[JsonPropertyName]` özgün JSON adlarını korur. Geçersiz/çakışan adlar düzeltilip benzersizleştirilir. Model adlarının tiplerle çakışmasını engellemek için tam nitelikli tip adları kullanılır. Nesne dizilerinin tüm öğeleri birlikte değerlendirilir: eksik/null alanlar ve null liste öğeleri nullable olur. Kök girdi nesne veya en az bir nesne içeren, yalnızca nesne/null öğelerinden oluşan dizi olmalıdır. Dizi kökünü deserialize etmek için üretilen yorumdaki kök tipi kullanın.

Sayısal değerler JavaScript yuvarlamasına uğramadan değerlendirilir: önce `int`, ardından `long`, uygunsa kayıpsız `decimal` seçilir. Uyumsuz/karışık tipler, decimal sınırlarını aşan sayılar, boş diziler ve yalnızca null içeren alanlar gerektiğinde nullable `JsonElement` kullanır; tip çıkarımı notları gösterilir. Tarihler varsayılan olarak `string` kalır; ISO tarih algılama seçeneği açıldığında saat dilimi taşıyan geçerli zaman damgaları `DateTimeOffset` olur. Sonuç yalnızca verilen örneği tanımlar, API sözleşmesi değildir; sayı aralıklarını ve nullable varsayımlarını kontrol edin.

İçerik tarayıcıda kalır; model üretimi 3 saniye süre sınırıyla ayrı worker'da yapılır. Sınırlar: 2 MB girdi, 64 iç içe seviye, 50.000 değer, 150 sınıf, sınıf başına 500 ve toplam 3.000 alan, 500.000 karakter çıktı. Aynı nesnedeki yinelenen alan adları sessizce silinmez, hata olarak bildirilir. Girdi/seçenek değişiklikleri eski çıktıyı temizler. Türkçe, İngilizce ve Almanca desteklenir.

`npm test` tip çıkarımı, arayüz, dosya, pano, indirme, worker ve Viewer aktarımı testlerini içerir. .NET 8 SDK kuruluysa `npm run test:csharp-dotnet` ayrıca yedi üretilmiş modeli derler; deserialize, sayı hassasiyeti, JSON adları ve nullable listeleri doğrular. `DIFFORA_DOTNET_BIN` ile dotnet yolu seçilebilir; `DIFFORA_DOTNET_ROOT` SDK referanslarıyla doğrudan Roslyn derlemesini etkinleştirir.

## Regex Tester

[Canlı araç](https://alpercetinkaya.com.tr/diffora/regex/) JavaScript düzenli ifadelerini `g`, `i`, `m`, `s`, `u` seçenekleriyle dener. Deseni çevresinde `/ /` olmadan girin, deneme metnini yapıştırın ve **Eşleşmeleri bul** veya **Değiştir** seçin. Eşleşmeler renklendirilir; numaralı, adlandırılmış ve eşleşmeyen isteğe bağlı gruplar listelenir. Boş eşleşmeler dik çizgiyle gösterilir. Konumlar sıfırdan başlayan UTF-16 indeksleridir.

Değiştirme JavaScript metin değiştirme kurallarını kullanır: `$$`, `$&`, `$1`–`$99`, `$<ad>` ve ön/son ek belirteçleri desteklenir. Değiştirilen metnin tamamı kopyalanabilir. Girdi ve seçenek değişiklikleri eski sonuçları temizler; araç ve dil değişiklikleri içeriği korur. İşlemler tarayıcıda, 2 saniye süre sınırı ve durdurma düğmesiyle ayrı bir Web Worker içinde çalışır. Uzun süren desenler arayüz iş parçacığında çalışmaz.

Sınırlar: UTF-8 deneme metni 200 KB, desen/değiştirme metni ayrı ayrı 10.000 karakter, toplam 20.000 eşleşme ve değiştirme sonucu 2.000.000 karakter. İşlem sınırı aşılırsa kısmi değiştirme sonucu yerine hata gösterilir. Renklendirme ilk 32.000 karakter ve 500 eşleşmeyle; liste ilk 100 eşleşme ve eşleşme başına 20 numaralı/adlandırılmış grupla sınırlıdır. Uzun değerler kısaltılır. Başarılı işlemlerde eşleşme sayısı ve kopyalanan değiştirme sonucu tamdır. Araç tarayıcının JavaScript sözdizimini kullanır; .NET/PCRE/PostgreSQL sözdizimi kullanmaz.

## Timestamp Dönüştürücü

[Canlı araç](https://alpercetinkaya.com.tr/diffora/timestamp/) Unix timestamp değerlerini tarihe, yerel tarih/saat girişlerini timestamp'e dönüştürür. Saniye, milisaniye veya otomatik algılama ile IANA saat dilimi seçilebilir. Sonuçlar saniye, milisaniye, UTC ISO 8601 ve UTC farkıyla birlikte yerel tarih/saat olarak gösterilir. Her sonuç ayrı kopyalanabilir. **Şu anı kullan** iki girdiyi de doldurur.

Otomatik algılama mutlak değeri 100 milyardan küçük sayıları saniye kabul eder; eski veya uzak tarihlerde birimi elle seçin. Saniyeler en fazla üç ondalık basamak, milisaniyeler tam sayı kabul eder. Tarih girişi seçilen saat dilimine aittir; varsayılan Europe/Istanbul'dur ve 0001–9999 yılları desteklenir. Geçersiz takvim tarihleri, yaz saati geçişinde yaşanmayan veya iki kez yaşanan saatler açık hata mesajıyla bildirilir. Belirsiz saatlerde UTC girişi veya kesin timestamp kullanın. Girdi/seçenek değişiklikleri eski sonucu temizler. Türkçe, İngilizce ve Almanca desteklenir; tüm işlemler tarayıcıda gerçekleşir.

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

Kaynak metin biçim hatasında otomatik düzeltilmez. Viewer en fazla 2 MB içerik kabul eder. DTD/DOCTYPE desteklenmez; en fazla 512 iç içe seviye ayrıştırılır. Ağaç görünümü normal içerikte 8.000 düğüm / 120 seviye, büyük içerikte 1.000 düğüm ile sınırlıdır; uzun anahtar ve değerler önizlemede kısaltılır. Kod önizlemesi en fazla 200 satır, 32.768 karakter ve satır başına 1.000 karakter gösterir. Büyük önizlemede renklendirme kapatılır. Bu sınırlar ekranda belirtilir; arama yalnızca görünen önizlemeyi kapsar. **Kopyala ve İndir her zaman tam çıktıyı kullanır.** XML şema/XSD doğrulaması yapılmaz.

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

### Büyük Viewer çıktıları

Gizli kod görünümü önceden çizilmez. Sıkıştırma yalnızca sınırlı önizlemeyi değiştirir; kopyalama ekrandaki kısaltılmış metni değil, tam formatlanmış sonucu kullanır. Kopyalama sürerken düğme devre dışıdır ve durum mesajı gösterilir. İçerik değiştirilirse eski kopyalama işleminin başarı mesajı yeni içeriğe taşınmaz.

`tests/viewer-large.cjs`, yapıştırılan 1,85 MB JSON, 2 MB'a yakın tek alanlı JSON, büyük XML, yinelenen sıkıştır/girintile/kopyala işlemleri, tam indirme ve pano hatalarını kapsar. Ek olarak `npm run bench:viewer` ile Node/jsdom ölçümü yapılabilir. Bu ölçüm tarayıcı çizim veya gerçek sistem panosu performansının yerine geçmez.
