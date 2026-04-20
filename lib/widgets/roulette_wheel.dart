import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../models/option.dart';

class RouletteWheel extends StatefulWidget {
  final List<Option> options;
  final void Function(Option) onResult;

  const RouletteWheel(
      {super.key, required this.options, required this.onResult});

  @override
  State<RouletteWheel> createState() => RouletteWheelState();
}

class RouletteWheelState extends State<RouletteWheel>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;
  CurvedAnimation? _curve;
  Animation<double>? _anim;
  double _rotation = 0; // cumulative degrees
  bool _spinning = false;
  final _rng = Random();

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(vsync: this);
    _ctrl.addListener(_onTick);
    _ctrl.addStatusListener(_onStatus);
  }

  void _onTick() {
    final anim = _anim;
    if (anim == null) return;
    final next = anim.value;
    if ((next ~/ 30) != (_rotation ~/ 30)) HapticFeedback.lightImpact();
    setState(() => _rotation = next);
  }

  void _onStatus(AnimationStatus s) {
    if (s == AnimationStatus.completed) {
      _spinning = false;
      HapticFeedback.heavyImpact();
      widget.onResult(_resultAt(_rotation));
    }
  }

  Option _resultAt(double deg) {
    final n = widget.options.length;
    final slice = 360.0 / n;
    final norm = ((deg % 360) + 360) % 360;
    final sel = ((360.0 - norm) + 360.0) % 360.0;
    return widget.options[(sel / slice).floor() % n];
  }

  void spin() {
    if (_spinning || widget.options.isEmpty) return;
    _spinning = true;
    final target =
        _rotation + (5 + _rng.nextDouble() * 5) * 360 + _rng.nextDouble() * 360;
    _ctrl.duration =
        Duration(milliseconds: 4000 + (_rng.nextDouble() * 1500).round());
    _curve?.dispose();
    _curve = CurvedAnimation(parent: _ctrl, curve: Curves.easeOut);
    _anim = Tween<double>(begin: _rotation, end: target).animate(_curve!);
    _ctrl.forward(from: 0);
  }

  @override
  void dispose() {
    _curve?.dispose();
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final maxW = MediaQuery.of(context).size.width - 32;
    final sz = min(maxW, 360.0);

    return SizedBox(
      width: sz + 16,
      height: sz + 16,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Outer ring
          Container(
            width: sz + 12,
            height: sz + 12,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(
                color: const Color(0xFF7C5CBF).withOpacity(0.4),
                width: 3,
              ),
            ),
          ),
          // Wheel
          Transform.rotate(
            angle: _rotation * pi / 180,
            child: SizedBox(
              width: sz,
              height: sz,
              child: CustomPaint(
                painter: _WheelPainter(options: widget.options),
              ),
            ),
          ),
          // Pointer shadow
          Positioned(
            top: 0,
            child: CustomPaint(
              painter: _TrianglePainter(
                  color: Colors.black.withOpacity(0.4)),
              size: const Size(28, 30),
            ),
          ),
          // Pointer
          Positioned(
            top: 1,
            child: CustomPaint(
              painter:
                  _TrianglePainter(color: const Color(0xFFFF6B6B)),
              size: const Size(22, 24),
            ),
          ),
        ],
      ),
    );
  }
}

// ── Painters ─────────────────────────────────────────────────────────────────

class _TrianglePainter extends CustomPainter {
  final Color color;
  const _TrianglePainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    canvas.drawPath(
      Path()
        ..moveTo(size.width / 2, 0)
        ..lineTo(0, size.height)
        ..lineTo(size.width, size.height)
        ..close(),
      Paint()..color = color,
    );
  }

  @override
  bool shouldRepaint(covariant _TrianglePainter old) => old.color != color;
}

class _WheelPainter extends CustomPainter {
  final List<Option> options;
  const _WheelPainter({required this.options});

  @override
  void paint(Canvas canvas, Size size) {
    final n = options.length;
    if (n == 0) return;

    final cx = size.width / 2;
    final cy = size.height / 2;
    final r = cx - 3;
    final center = Offset(cx, cy);
    final slice = (2 * pi) / n;
    const top = -pi / 2; // slices start at 12 o'clock

    for (var i = 0; i < n; i++) {
      final start = top + i * slice;
      final rect = Rect.fromCircle(center: center, radius: r);

      canvas.drawArc(rect, start, slice, true, Paint()..color = options[i].color);
      canvas.drawArc(
        rect, start, slice, true,
        Paint()
          ..color = Colors.black.withOpacity(0.15)
          ..style = PaintingStyle.stroke
          ..strokeWidth = 1,
      );

      // Label
      final mid = start + slice / 2;
      final tx = cx + r * 0.65 * cos(mid);
      final ty = cy + r * 0.65 * sin(mid);
      canvas.save();
      canvas.translate(tx, ty);
      canvas.rotate(mid + pi / 2);

      final raw = options[i].label;
      final label = raw.length > 10 ? '${raw.substring(0, 9)}…' : raw;
      final tp = TextPainter(
        text: TextSpan(
          text: label,
          style: TextStyle(
            color: Colors.white,
            fontSize: n > 8 ? 11 : 13,
            fontWeight: FontWeight.bold,
          ),
        ),
        textDirection: TextDirection.ltr,
      )..layout();
      tp.paint(canvas, Offset(-tp.width / 2, -tp.height / 2));
      canvas.restore();
    }

    // Decorative outer ring
    canvas.drawCircle(
      center, r,
      Paint()
        ..color = Colors.white.withOpacity(0.12)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2,
    );

    // Hub
    canvas.drawCircle(center, 28, Paint()..color = const Color(0xFF1A1A2E));
    canvas.drawCircle(center, 22, Paint()..color = const Color(0xFF16213E));
    canvas.drawCircle(center, 14, Paint()..color = const Color(0xFF7C5CBF));
    canvas.drawCircle(center, 6, Paint()..color = Colors.white);
  }

  @override
  bool shouldRepaint(covariant _WheelPainter old) => old.options != options;
}
