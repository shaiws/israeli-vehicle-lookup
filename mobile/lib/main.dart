import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:http/http.dart' as http;

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const VehicleLookupApp());
}

class VehicleLookupApp extends StatelessWidget {
  const VehicleLookupApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'חיפוש רכב',
      debugShowCheckedModeBanner: false,
      locale: const Locale('he'),
      supportedLocales: const [Locale('he'), Locale('en')],
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0F766E),
          brightness: Brightness.light,
        ),
        useMaterial3: true,
        fontFamily: 'Roboto',
      ),
      builder: (context, child) => Directionality(
        textDirection: TextDirection.rtl,
        child: child ?? const SizedBox.shrink(),
      ),
      home: const LookupPage(),
    );
  }
}

class ResourceDef {
  final String key;
  final String title;
  final String resourceId;
  final String plateField;
  final String role; // primary | fallback | history | recall

  const ResourceDef({
    required this.key,
    required this.title,
    required this.resourceId,
    this.plateField = 'mispar_rechev',
    required this.role,
  });
}

const ckanDatastore =
    'https://data.gov.il/api/3/action/datastore_search';

const resources = <ResourceDef>[
  ResourceDef(
    key: 'active',
    title: 'רישום פעיל — פרטי / מסחרי',
    resourceId: '053cea08-09bc-40ec-8f7a-156f0677aff3',
    role: 'primary',
  ),
  ResourceDef(
    key: 'continuation',
    title: 'המשך רישום פעיל (צמיגים / גרירה)',
    resourceId: '0866573c-40cd-4ca8-91d2-9dd2d7a492e5',
    role: 'history',
  ),
  ResourceDef(
    key: 'odometer',
    title: 'היסטוריה — קילומטרים ובדיקות',
    resourceId: '56063a99-8a3e-4ff4-912e-5966c0279bad',
    role: 'history',
  ),
  ResourceDef(
    key: 'ownership',
    title: 'היסטוריית סוג בעלות',
    resourceId: 'bb2355dc-9ec7-4f06-9c3f-3344672171da',
    role: 'history',
  ),
  ResourceDef(
    key: 'cancelled',
    title: 'ביטול סופי',
    resourceId: '851ecab1-0622-4dbe-a6c7-f950cf82abf9',
    role: 'fallback',
  ),
  ResourceDef(
    key: 'inactive_no_model',
    title: 'לא פעיל — ללא דגם',
    resourceId: '6f6acd03-f351-4a8f-8ecf-df792f4f573a',
    role: 'fallback',
  ),
  ResourceDef(
    key: 'inactive_with_model',
    title: 'לא פעיל — עם דגם',
    resourceId: 'f6efe89a-fb3d-43a4-bb61-9bf12a9b9099',
    role: 'fallback',
  ),
  ResourceDef(
    key: 'heavy',
    title: 'רכב כבד',
    resourceId: 'cd3acc5c-03c3-4c89-9c54-d40f93c0d790',
    role: 'fallback',
  ),
  ResourceDef(
    key: 'motorcycle',
    title: 'אופנועים',
    resourceId: 'bf9df4e2-d90d-4c0a-a400-19e15af8e95f',
    role: 'fallback',
  ),
  ResourceDef(
    key: 'public',
    title: 'רכב ציבורי',
    resourceId: 'cf29862d-ca25-4691-84f6-1be60dcb4a1e',
    role: 'fallback',
  ),
  ResourceDef(
    key: 'recall_by_plate',
    title: 'ריקול / הגבלת ריקול לפי מספר רכב',
    resourceId: '36bf1404-0be4-49d2-82dc-2f1ead4a8b93',
    plateField: 'MISPAR_RECHEV',
    role: 'recall',
  ),
];

const fieldLabels = <String, String>{
  '_id': 'מזהה רשומה',
  'mispar_rechev': 'מספר רכב',
  'MISPAR_RECHEV': 'מספר רכב',
  'tozeret_nm': 'שם יצרן',
  'tozeret_eretz_nm': 'ארץ ייצור',
  'degem_nm': 'שם דגם',
  'kinuy_mishari': 'כינוי מסחרי',
  'ramat_gimur': 'רמת גימור',
  'shnat_yitzur': 'שנת ייצור',
  'mivchan_acharon_dt': 'תאריך מבחן אחרון',
  'tokef_dt': 'תוקף רישוי',
  'baalut': 'סוג בעלות',
  'tzeva_rechev': 'צבע רכב',
  'sug_delek_nm': 'סוג דלק',
  'moed_aliya_lakvish': 'מועד עלייה לכביש',
  'kilometer_test_aharon': 'ק״מ במבחן אחרון',
  'sug_rechev_nm': 'סוג רכב',
  'bitul_dt': 'תאריך ביטול',
  'bitul_nm': 'סטטוס ביטול',
  'nefach_manoa': 'נפח מנוע',
  'RECALL_ID': 'מזהה ריקול',
  'SUG_RECALL': 'סוג ריקול',
  'TEUR_TAKALA': 'תיאור תקלה',
  'TAARICH_PTICHA': 'תאריך פתיחה',
  'TOZAR_TEUR': 'יצרן (ריקול)',
  'DEGEM': 'דגם (ריקול)',
};

String labelFor(String field) => fieldLabels[field] ?? field;

String digitsOnlyPlate(String input) => input.replaceAll(RegExp(r'\D'), '');

String formatPlateDisplay(String digits) {
  if (digits.length == 7) {
    return '${digits.substring(0, 2)}-${digits.substring(2, 5)}-${digits.substring(5)}';
  }
  if (digits.length == 8) {
    return '${digits.substring(0, 3)}-${digits.substring(3, 5)}-${digits.substring(5)}';
  }
  return digits;
}

class DatasetHit {
  final String key;
  final String title;
  final String resourceId;
  final List<Map<String, dynamic>> records;
  final int total;
  final String? error;

  DatasetHit({
    required this.key,
    required this.title,
    required this.resourceId,
    required this.records,
    required this.total,
    this.error,
  });
}

class LookupResult {
  final String plate;
  final bool found;
  final String? primaryKey;
  final String? primaryTitle;
  final Map<String, dynamic>? primary;
  final List<DatasetHit> sections;
  final List<String> errors;

  LookupResult({
    required this.plate,
    required this.found,
    this.primaryKey,
    this.primaryTitle,
    this.primary,
    required this.sections,
    required this.errors,
  });
}

Future<Map<String, dynamic>> datastoreSearch({
  required String resourceId,
  required Map<String, dynamic> filters,
  int limit = 100,
}) async {
  final uri = Uri.parse(ckanDatastore).replace(queryParameters: {
    'resource_id': resourceId,
    'limit': '$limit',
    'offset': '0',
    'filters': jsonEncode(filters),
  });
  final res = await http.get(uri, headers: {'Accept': 'application/json'});
  if (res.statusCode != 200) {
    throw Exception('HTTP ${res.statusCode} עבור משאב $resourceId');
  }
  return jsonDecode(utf8.decode(res.bodyBytes)) as Map<String, dynamic>;
}

Future<({List<Map<String, dynamic>> records, int total})> searchByPlate(
  String resourceId,
  String plateDigits, {
  String plateField = 'mispar_rechev',
}) async {
  final numeric = int.tryParse(plateDigits) ?? 0;
  final variants = <dynamic>[numeric];
  if (plateDigits != '$numeric') variants.add(plateDigits);
  if (plateDigits.length < 8) {
    variants.add(plateDigits.padLeft(7, '0'));
    variants.add(plateDigits.padLeft(8, '0'));
  }

  Object? lastError;
  for (final value in variants) {
    try {
      final data = await datastoreSearch(
        resourceId: resourceId,
        filters: {plateField: value},
      );
      if (data['success'] != true) {
        lastError = data['error']?['message'] ?? 'CKAN error';
        continue;
      }
      final result = data['result'] as Map<String, dynamic>? ?? {};
      final records = ((result['records'] as List?) ?? [])
          .map((e) => Map<String, dynamic>.from(e as Map))
          .toList();
      final total = (result['total'] as num?)?.toInt() ?? records.length;
      if (total > 0 || records.isNotEmpty) {
        return (records: records, total: total);
      }
      if (value is int) continue;
      return (records: records, total: total);
    } catch (err) {
      lastError = err;
    }
  }
  if (lastError != null) {
    throw lastError is Exception ? lastError as Exception : Exception('$lastError');
  }
  return (records: <Map<String, dynamic>>[], total: 0);
}

Future<DatasetHit> queryResource(ResourceDef def, String plate) async {
  try {
    final result = await searchByPlate(
      def.resourceId,
      plate,
      plateField: def.plateField,
    );
    return DatasetHit(
      key: def.key,
      title: def.title,
      resourceId: def.resourceId,
      records: result.records,
      total: result.total,
    );
  } catch (err) {
    return DatasetHit(
      key: def.key,
      title: def.title,
      resourceId: def.resourceId,
      records: const [],
      total: 0,
      error: '$err',
    );
  }
}

DatasetHit? firstRecord(List<DatasetHit> hits) {
  for (final hit in hits) {
    if (hit.records.isNotEmpty) return hit;
  }
  return null;
}

Future<LookupResult> lookupVehicle(String rawPlate) async {
  final plate = digitsOnlyPlate(rawPlate);
  if (plate.isEmpty || plate.length < 5 || plate.length > 8) {
    throw Exception('מספר לוחית רישוי חייב להיות באורך 5–8 ספרות (ספרות בלבד)');
  }

  final errors = <String>[];
  final sections = <DatasetHit>[];

  final primary = resources.where((r) => r.role == 'primary').toList();
  final fallback = resources.where((r) => r.role == 'fallback').toList();
  final history = resources.where((r) => r.role == 'history').toList();
  final recall = resources.where((r) => r.role == 'recall').toList();

  final primaryHits = await Future.wait(primary.map((d) => queryResource(d, plate)));
  for (final h in primaryHits) {
    sections.add(h);
    if (h.error != null) errors.add('${h.title}: ${h.error}');
  }
  var primaryHit = firstRecord(primaryHits);

  if (primaryHit == null) {
    final fallbackHits =
        await Future.wait(fallback.map((d) => queryResource(d, plate)));
    for (final h in fallbackHits) {
      if (!sections.any((s) => s.key == h.key)) sections.add(h);
      if (h.error != null) errors.add('${h.title}: ${h.error}');
    }
    primaryHit = firstRecord(fallbackHits);
  }

  final pending = [...history, ...recall]
      .where((d) => !sections.any((s) => s.key == d.key))
      .toList();
  final extraHits = await Future.wait(pending.map((d) => queryResource(d, plate)));
  for (final h in extraHits) {
    if (!sections.any((s) => s.key == h.key)) sections.add(h);
    if (h.error != null) errors.add('${h.title}: ${h.error}');
  }

  if (primaryHit == null) {
    final historyHits =
        extraHits.where((h) => history.any((d) => d.key == h.key)).toList();
    primaryHit = firstRecord(historyHits);
  }

  final order = [...primary, ...fallback, ...history, ...recall]
      .map((d) => d.key)
      .toList();
  sections.sort((a, b) => order.indexOf(a.key).compareTo(order.indexOf(b.key)));

  return LookupResult(
    plate: plate,
    found: primaryHit != null,
    primaryKey: primaryHit?.key,
    primaryTitle: primaryHit?.title,
    primary: primaryHit?.records.isNotEmpty == true
        ? primaryHit!.records.first
        : null,
    sections: sections,
    errors: errors,
  );
}

class LookupPage extends StatefulWidget {
  const LookupPage({super.key});

  @override
  State<LookupPage> createState() => _LookupPageState();
}

class _LookupPageState extends State<LookupPage> {
  final _controller = TextEditingController();
  LookupResult? _result;
  String? _error;
  bool _loading = false;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _search() async {
    setState(() {
      _loading = true;
      _error = null;
      _result = null;
    });
    try {
      final result = await lookupVehicle(_controller.text);
      setState(() => _result = result);
    } catch (e) {
      setState(() => _error = '$e');
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    return Scaffold(
      appBar: AppBar(
        title: const Text('חיפוש רכב — data.gov.il'),
        backgroundColor: cs.primaryContainer,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Text(
                'נתונים טכניים ממאגרי משרד התחבורה ב־data.gov.il בלבד. '
                'אין מידע על זהות בעלים או פרטים אישיים.',
                style: Theme.of(context).textTheme.bodyMedium,
              ),
            ),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _controller,
            keyboardType: TextInputType.number,
            inputFormatters: [FilteringTextInputFormatter.digitsOnly],
            decoration: const InputDecoration(
              labelText: 'מספר לוחית (5–8 ספרות)',
              border: OutlineInputBorder(),
              hintText: '1234567',
            ),
            onSubmitted: (_) => _search(),
          ),
          const SizedBox(height: 12),
          FilledButton.icon(
            onPressed: _loading ? null : _search,
            icon: _loading
                ? const SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Icon(Icons.search),
            label: Text(_loading ? 'מחפש…' : 'חפש'),
          ),
          if (_error != null) ...[
            const SizedBox(height: 12),
            Text(_error!, style: TextStyle(color: cs.error)),
          ],
          if (_result != null) ...[
            const SizedBox(height: 16),
            _ResultView(result: _result!),
          ],
        ],
      ),
    );
  }
}

class _ResultView extends StatelessWidget {
  final LookupResult result;
  const _ResultView({required this.result});

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Card(
          color: result.found ? cs.secondaryContainer : cs.errorContainer,
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Text(
              result.found
                  ? 'נמצא: ${formatPlateDisplay(result.plate)}'
                      '${result.primaryTitle != null ? ' · ${result.primaryTitle}' : ''}'
                  : 'לא נמצאו רשומות עבור ${formatPlateDisplay(result.plate)}',
              style: Theme.of(context).textTheme.titleMedium,
            ),
          ),
        ),
        if (result.primary != null) ...[
          const SizedBox(height: 8),
          _RecordCard(title: 'רשומה ראשית', record: result.primary!),
        ],
        for (final section in result.sections)
          if (section.records.isNotEmpty) ...[
            const SizedBox(height: 8),
            _SectionCard(hit: section),
          ],
        if (result.errors.isNotEmpty) ...[
          const SizedBox(height: 8),
          Text(
            'שגיאות חלקיות:\n${result.errors.join('\n')}',
            style: TextStyle(color: cs.error, fontSize: 12),
          ),
        ],
      ],
    );
  }
}

class _SectionCard extends StatelessWidget {
  final DatasetHit hit;
  const _SectionCard({required this.hit});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ExpansionTile(
        title: Text(hit.title),
        subtitle: Text('${hit.records.length} רשומות'),
        children: [
          for (final r in hit.records.take(5))
            _RecordCard(title: null, record: r, dense: true),
        ],
      ),
    );
  }
}

class _RecordCard extends StatelessWidget {
  final String? title;
  final Map<String, dynamic> record;
  final bool dense;

  const _RecordCard({
    required this.title,
    required this.record,
    this.dense = false,
  });

  @override
  Widget build(BuildContext context) {
    final entries = record.entries
        .where((e) => e.value != null && '${e.value}'.trim().isNotEmpty)
        .where((e) => e.key != '_id')
        .take(dense ? 12 : 40)
        .toList();
    return Card(
      margin: dense ? const EdgeInsets.all(8) : EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (title != null)
              Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Text(title!, style: Theme.of(context).textTheme.titleMedium),
              ),
            for (final e in entries)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 2),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    SizedBox(
                      width: 140,
                      child: Text(
                        labelFor(e.key),
                        style: const TextStyle(fontWeight: FontWeight.w600),
                      ),
                    ),
                    Expanded(child: Text('${e.value}')),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}
