# Site font subsets

Amen17 Myeongjo is a subset of Nanum Myeongjo Regular and Bold (NHN Corporation).
Amen17 Decorative is a subset of Cinzel Decorative Regular (Natanael Gama).
Both are distributed under the SIL Open Font License 1.1; the original licenses
and copyright notices are included alongside this file.

The subset font family and internal names have been changed to respect the
Reserved Font Names. Glyph outlines, layout features, and metrics are preserved.

Pinned sources:

- https://github.com/google/fonts/tree/f12cf9db03e887b61a34ead809ec1b632bd013b5/ofl/nanummyeongjo
- https://github.com/google/fonts/tree/3dd78844021e948ceb633d1dcee3f7885561b5d9/ofl/cinzeldecorative

Generation: `python scripts/prepare-fonts.py --download` from the repository root.
Later runs can reuse the local source cache without `--download`.
Requires Python packages `fonttools` and `brotli`, plus `npm ci` in `FE`.
The site build checks source text against the committed font manifest; new
characters require regeneration before publishing. Font generation is not part
of deployment, so normal builds do not need Python or external font requests.
