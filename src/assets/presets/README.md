# How to Modify Exam Presets

To ensure stability and reliable performance, the preset lists for "Examinations" mode (e.g., Trial HSC, Half Yearly) are now managed directly within the application's code.

To edit these presets, you will need to modify the `EXAM_PRESETS` object located in the `src/constants.ts` file.

---

## Special Note on NAPLAN Presets

The "NAPLAN" session type uses a special, interactive setup screen instead of a static preset list. All configuration for NAPLAN exams, including generating test groups and adding catch-up exams, is handled directly within the application's user interface for a more streamlined experience.