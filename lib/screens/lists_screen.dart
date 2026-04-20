import 'package:flutter/material.dart';
import '../data/curated_lists.dart';
import '../models/option.dart';
import '../services/storage_service.dart';

class ListsScreen extends StatefulWidget {
  final Map<String, List<Option>> customOptions;
  const ListsScreen({super.key, required this.customOptions});

  @override
  State<ListsScreen> createState() => _ListsScreenState();
}

class _ListsScreenState extends State<ListsScreen>
    with SingleTickerProviderStateMixin {
  late final TabController _tabs;
  late final Map<String, List<Option>> _options;

  static const _palette = [
    Color(0xFFFF6B6B), Color(0xFFFFD93D), Color(0xFF6BCB77),
    Color(0xFF4D96FF), Color(0xFFFF922B), Color(0xFFCC5DE8),
    Color(0xFF20C997), Color(0xFFF06595), Color(0xFF74C0FC),
    Color(0xFFA9E34B), Color(0xFFFF8787), Color(0xFF63E6BE),
  ];

  @override
  void initState() {
    super.initState();
    _tabs = TabController(length: curatedCategories.length, vsync: this);
    _options = {
      for (final c in curatedCategories)
        c.id: List<Option>.from(
            widget.customOptions[c.id] ?? c.defaultOptions),
    };
  }

  @override
  void dispose() {
    _tabs.dispose();
    super.dispose();
  }

  Future<void> _addOption(String catId) async {
    final ctrl = TextEditingController();
    final label = await showDialog<String>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1A1A2E),
        title: const Text('Add Option',
            style: TextStyle(color: Colors.white)),
        content: TextField(
          controller: ctrl,
          autofocus: true,
          style: const TextStyle(color: Colors.white),
          decoration: const InputDecoration(
            hintText: 'Option name',
            hintStyle: TextStyle(color: Colors.white38),
            enabledBorder: UnderlineInputBorder(
                borderSide: BorderSide(color: Color(0xFF7C5CBF))),
            focusedBorder: UnderlineInputBorder(
                borderSide:
                    BorderSide(color: Color(0xFF7C5CBF), width: 2)),
          ),
          onSubmitted: (v) => Navigator.of(ctx).pop(v.trim()),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Cancel',
                style: TextStyle(color: Colors.white54)),
          ),
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(ctrl.text.trim()),
            child: const Text('Add',
                style: TextStyle(color: Color(0xFF7C5CBF))),
          ),
        ],
      ),
    );
    if (label == null || label.isEmpty) return;
    final list = List<Option>.from(_options[catId]!);
    list.add(Option(
      id: '${catId}_${DateTime.now().millisecondsSinceEpoch}',
      label: label,
      color: _palette[list.length % _palette.length],
    ));
    setState(() => _options[catId] = list);
    await StorageService.saveOptions(catId, list);
  }

  Future<void> _deleteOption(String catId, int idx) async {
    final list = List<Option>.from(_options[catId]!)..removeAt(idx);
    setState(() => _options[catId] = list);
    await StorageService.saveOptions(catId, list);
  }

  Future<void> _reset(String catId) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1A1A2E),
        title: const Text('Reset to defaults?',
            style: TextStyle(color: Colors.white)),
        content: const Text(
            'This will replace your custom list with the originals.',
            style: TextStyle(color: Colors.white70)),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(false),
            child: const Text('Cancel',
                style: TextStyle(color: Colors.white54)),
          ),
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(true),
            child: const Text('Reset',
                style: TextStyle(color: Color(0xFFFF6B6B))),
          ),
        ],
      ),
    );
    if (confirmed != true) return;
    final defaults = curatedCategories
        .firstWhere((c) => c.id == catId)
        .defaultOptions;
    final list = List<Option>.from(defaults);
    setState(() => _options[catId] = list);
    await StorageService.clearOptions(catId);
  }

  void _pop() => Navigator.of(context).pop(_options);

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvoked: (didPop) {
        if (!didPop) _pop();
      },
      child: Scaffold(
        backgroundColor: const Color(0xFF0D0D1A),
        appBar: AppBar(
          backgroundColor: const Color(0xFF0D0D1A),
          elevation: 0,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back_ios_new_rounded,
                color: Colors.white),
            onPressed: _pop,
          ),
          title: const Text(
            'MY LISTS',
            style: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.w900,
              letterSpacing: 4,
            ),
          ),
          bottom: TabBar(
            controller: _tabs,
            isScrollable: true,
            indicatorColor: const Color(0xFF7C5CBF),
            labelColor: Colors.white,
            unselectedLabelColor: Colors.white54,
            tabs: curatedCategories
                .map((c) => Tab(text: '${c.emoji} ${c.name}'))
                .toList(),
          ),
        ),
        body: TabBarView(
          controller: _tabs,
          children: curatedCategories.map((cat) {
            final opts = _options[cat.id] ?? [];
            return Column(
              children: [
                Expanded(
                  child: opts.isEmpty
                      ? const Center(
                          child: Text(
                            'No options yet.\nTap + to add some.',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                                color: Colors.white38, fontSize: 16),
                          ),
                        )
                      : ListView.builder(
                          padding: const EdgeInsets.all(16),
                          itemCount: opts.length,
                          itemBuilder: (_, i) => _OptionTile(
                            option: opts[i],
                            onDelete: () => _deleteOption(cat.id, i),
                          ),
                        ),
                ),
                _BottomActions(
                  onAdd: () => _addOption(cat.id),
                  onReset: () => _reset(cat.id),
                ),
              ],
            );
          }).toList(),
        ),
      ),
    );
  }
}

// ── Sub-widgets ───────────────────────────────────────────────────────────────

class _OptionTile extends StatelessWidget {
  final Option option;
  final VoidCallback onDelete;
  const _OptionTile({required this.option, required this.onDelete});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1A2E),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white.withOpacity(0.07)),
      ),
      child: ListTile(
        leading: Container(
          width: 14,
          height: 14,
          decoration:
              BoxDecoration(color: option.color, shape: BoxShape.circle),
        ),
        title: Text(option.label,
            style: const TextStyle(color: Colors.white, fontSize: 15)),
        trailing: IconButton(
          icon: const Icon(Icons.delete_outline_rounded,
              color: Colors.white38, size: 20),
          onPressed: onDelete,
        ),
      ),
    );
  }
}

class _BottomActions extends StatelessWidget {
  final VoidCallback onAdd;
  final VoidCallback onReset;
  const _BottomActions({required this.onAdd, required this.onReset});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
      decoration: BoxDecoration(
        color: const Color(0xFF0D0D1A),
        border: Border(
            top: BorderSide(color: Colors.white.withOpacity(0.08))),
      ),
      child: Row(
        children: [
          Expanded(
            child: ElevatedButton.icon(
              onPressed: onAdd,
              icon: const Icon(Icons.add_rounded, size: 20),
              label: const Text('Add Option'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF7C5CBF),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ),
          const SizedBox(width: 12),
          OutlinedButton(
            onPressed: onReset,
            style: OutlinedButton.styleFrom(
              foregroundColor: Colors.white54,
              side: BorderSide(color: Colors.white.withOpacity(0.2)),
              padding: const EdgeInsets.symmetric(
                  vertical: 14, horizontal: 16),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12)),
            ),
            child: const Text('Reset'),
          ),
        ],
      ),
    );
  }
}
