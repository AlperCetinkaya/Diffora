# Diffora

[Türkçe](README.md) | [English](README.en.md)

İki metin veya kod dosyasının ilk ve son halini yan yana karşılaştıran, tarayıcı içinde çalışan bir web uygulaması. Aynı satırlar yeşil, farklı satırlar kırmızı gösterilir. Eklenen ve silinen satırlar için karşı tarafta boş alan bırakılarak hizalama korunur.

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

Testler uzun dosyalar, dağınık değişiklikler, kapasite hatası sonrası durum, farklar arasında gezinme ve yok sayılan boşluk vurgularını kapsar. İlk komut `fixtures/` altında örnek TXT dosyalarını ve `results.json` dosyasını üretir. DOM durum testleri bir test modeli kullanır; gerçek tarayıcı testinin yerine geçmez.
