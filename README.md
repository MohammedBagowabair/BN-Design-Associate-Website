# B&N Design Associate — website concept (EN / BM)

Bilingual pitch website for **B&N Design Associate Sdn. Bhd.**, 38-1 Jalan Rampai Niaga 4, Rampai Business Park, 53300 Kuala Lumpur.

Live: https://mohammedbagowabair.github.io/BN-Design-Associate-Website/ · Malay: `?lang=ms`

- Award-led hero (Atap Design Award 2023 plaques) and client register
- Mercure Hotel Miri explorer: five spaces (Atoti, Belian, Terabai, guest rooms, CavaKita) with SVG illustrations drawn from B&N's own design notes
- Filterable register of 45 projects from B&N's project list (duplicates removed, spelling tidied)
- Project-brief builder styled as a drawing title block → WhatsApp or email
- Contact with office line, mobile/WhatsApp, email, live office-hours status, bilingual FAQ and 404

Copy, projects, clients and awards are taken from bnndesign.com. Hotel photos are Mercure Miri City Centre's own (credited on the page); residential photos are B&N's own project photos (bnndesign.com watermark) from their public directory listing. Map © OpenStreetMap contributors. No stock images.

```bash
npm ci
BASE_PATH=/BN-Design-Associate-Website/ npm run build
npx gh-pages -d dist
```

_Website concept prepared for this studio. Not an official site yet._
