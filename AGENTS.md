# AI Agent Instructions: Range Component Technical Test

This document contains strict architectural guidelines and immutable technical constraints for this Next.js App Router project. You must adhere to these rules in every response and code generation.

## 1. Immutable Technical Constraints (Mango Test Requirements)
- **NO NATIVE RANGE INPUTS:** You are strictly forbidden from using the HTML5 `<input type="range" />` element. The range slider must be a 100% custom implementation using standard DOM elements (divs, buttons) and pointer events (pointerdown, pointermove, pointerup).
- **Two Operating Modes:** The `<Range />` component must support a `normal` mode (continuous values, editable endpoints) and a `fixed` mode (snaps to specific array values, read-only endpoints).
- **Handle Collision:** The minimum handle and maximum handle can never cross each other under any circumstances.
- **Cursor States:** When hovered, a handle must visually enlarge and show the `cursor-grab` CSS class. While dragging, the cursor must change to `cursor-grabbing` on the entire document to indicate active interaction.
- **Mocked Endpoints:** The app must consume data from local endpoints (`/api/range/normal` and `/api/range/fixed`).

## 2. Component Architecture & Folder Structure (Enterprise Standard)
All components must follow a strict folder-per-component architecture to ensure scalability and maintainability.
- **Dedicated Folders:** Every component must reside in its own folder inside `src/components/` (e.g., `src/components/RangeHandle/`).
- **File Naming:** The main component file must be named in PascalCase (e.g., `RangeHandle.tsx`).
- **Index Exports:** Every component folder must contain an `index.ts` file that exports the component as default (`export { default } from "./RangeHandle";`).
- **Co-location:** Tests and TypeScript interfaces must be co-located within the component's folder. Use the naming conventions `ComponentName.test.tsx` and `ComponentName.types.ts`.
- **Logic Separation:** Complex state and event logic must be extracted into custom hooks (e.g., `useRange.ts`). Pure mathematical or formatting functions must be extracted into `utils.ts` and tested separately.

## 3. Styling and Import Rules
- **Styling:** Use Tailwind CSS for all styling. Do not use inline styles (`style={{...}}`) unless passing highly dynamic, frequently changing calculated values (like the percentage position of a slider handle).
- **Imports:** Always use the `@/` alias for absolute imports pointing to the `src/` directory (e.g., `@/components/Range/Range.types`). Never use deep relative paths like `../../components/`.

## 4. Testing
- **Coverage:** Implement comprehensive unit and integration tests using Jest and React Testing Library.
- **Behavior Assertions:** Tests must verify pointer events, keyboard accessibility, handle collision prevention, cursor class toggles, and correct API data fetching.