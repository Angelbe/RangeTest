# Custom Range Exercise

An accessible, custom-built dual-handle range selector for Next.js 16, React,
TypeScript, and Tailwind CSS. The component uses pointer events and standard DOM
elements; it does not use an HTML range input.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) and choose an exercise:

- `/exercise1` — continuous selection from the service-provided range of 1–100.
  Click either displayed endpoint to enter a value within its allowed bounds.
- `/exercise2` — selection snaps to the service-provided fixed price values;
  the displayed endpoint values are read-only.

## Mock services

- `GET /api/range/normal` returns `{ "min": 1, "max": 100 }`.
- `GET /api/range/fixed` returns
  `{ "values": [1.99, 5.99, 10.99, 30.99, 50.99, 70.99] }`.

## Validation

```bash
npm test -- --runInBand
npm run lint
npx tsc --noEmit
npm run build
```
