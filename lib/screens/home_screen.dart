import 'package:flutter/material.dart';
import '../data/curated_lists.dart';
import '../models/option.dart';
import '../services/storage_service.dart';
import '../widgets/roulette_wheel.dart';
import '../widgets/result_modal.dart';
import 'lists_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _wheelKey = GlobalKey<RouletteWheelState>();
  int _catIdx = 0;
  Map<String, List<Option>> _customOptions = {};
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadAll();
  }

  Future<void> _loadAll() async {
    final map = <String, List<Option>>{};
    for (final cat in curatedCategories) {
      final stored = await StorageService.loadOptions(cat.id);
      if (stored != null) map[cat.id] = stored;
    }
    setState(() {
      _customOptions = map;
      _loading = false;
    });
  }

  List<Option> get _currentOptions {
    final cat = curatedCategories[_catIdx];
    return _customOptions[cat.id] ?? cat.defaultOptions;
  }

  void _onResult(Option opt) => ResultModal.show(context, opt);

  Future<void> _goToLists() async {
    final updated = await Navigator.push<Map<String, List<Option>>>(
      context,
      MaterialPageRoute(
        builder: (_) =>
            ListsScreen(customOptions: Map.from(_customOptions)),
      ),
    );
    if (updated != null) setState(() => _customOptions = updated);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0D0D1A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0D0D1A),
        elevation: 0,
        centerTitle: true,
        title: const Text(
          'DECIDER',
          style: TextStyle(
            color: Colors.white,
            fontSize: 22,
            fontWeight: FontWeight.w900,
            letterSpacing: 6,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.tune_rounded,
                color: Color(0xFF7C5CBF), size: 26),
            onPressed: _goToLists,
          ),
        ],
      ),
      body: _loading
          ? const Center(
              child: CircularProgressIndicator(color: Color(0xFF7C5CBF)))
          : Column(
              children: [
                const SizedBox(height: 8),
                _buildCategoryChips(),
                const SizedBox(height: 16),
                Expanded(
                  child: Center(
                    child: RouletteWheel(
                      key: _wheelKey,
                      options: _currentOptions,
                      onResult: _onResult,
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                _SpinButton(onTap: () => _wheelKey.currentState?.spin()),
                const SizedBox(height: 40),
              ],
            ),
    );
  }

  Widget _buildCategoryChips() {
    return SizedBox(
      height: 44,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: curatedCategories.length,
        itemBuilder: (_, i) {
          final cat = curatedCategories[i];
          final sel = i == _catIdx;
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: GestureDetector(
              onTap: () => setState(() => _catIdx = i),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                padding: const EdgeInsets.symmetric(
                    horizontal: 16, vertical: 10),
                decoration: BoxDecoration(
                  color: sel
                      ? const Color(0xFF7C5CBF)
                      : const Color(0xFF1A1A2E),
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(
                    color: sel
                        ? const Color(0xFF7C5CBF)
                        : Colors.white.withOpacity(0.15),
                  ),
                ),
                child: Text(
                  '${cat.emoji} ${cat.name}',
                  style: TextStyle(
                    color: sel ? Colors.white : Colors.white70,
                    fontWeight:
                        sel ? FontWeight.bold : FontWeight.normal,
                    fontSize: 14,
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

class _SpinButton extends StatelessWidget {
  final VoidCallback onTap;
  const _SpinButton({required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 180,
        height: 56,
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Color(0xFF7C5CBF), Color(0xFFAB85E8)],
          ),
          borderRadius: BorderRadius.circular(28),
          boxShadow: const [
            BoxShadow(
              color: Color(0x667C5CBF),
              blurRadius: 20,
              offset: Offset(0, 8),
            ),
          ],
        ),
        child: const Center(
          child: Text(
            'SPIN',
            style: TextStyle(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.w900,
              letterSpacing: 4,
            ),
          ),
        ),
      ),
    );
  }
}
