import 'package:flutter/material.dart';
import '../models/option.dart';

class ResultModal extends StatelessWidget {
  final Option option;
  const ResultModal({super.key, required this.option});

  static Future<void> show(BuildContext context, Option option) {
    return showGeneralDialog(
      context: context,
      barrierDismissible: true,
      barrierLabel: 'dismiss',
      barrierColor: Colors.black54,
      transitionDuration: const Duration(milliseconds: 450),
      pageBuilder: (_, __, ___) => ResultModal(option: option),
      transitionBuilder: (_, anim, __, child) => ScaleTransition(
        scale: CurvedAnimation(parent: anim, curve: Curves.elasticOut),
        child: FadeTransition(opacity: anim, child: child),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Material(
        color: Colors.transparent,
        child: Container(
          margin: const EdgeInsets.symmetric(horizontal: 32),
          decoration: BoxDecoration(
            color: const Color(0xFF1A1A2E),
            borderRadius: BorderRadius.circular(24),
            border:
                Border.all(color: option.color.withOpacity(0.6), width: 2),
            boxShadow: [
              BoxShadow(
                color: option.color.withOpacity(0.3),
                blurRadius: 40,
                spreadRadius: 4,
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 16),
                decoration: BoxDecoration(
                  color: option.color,
                  borderRadius:
                      const BorderRadius.vertical(top: Radius.circular(22)),
                ),
                child: const Text(
                  'The Decider says…',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(32, 32, 32, 8),
                child: Text(
                  option.label,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    height: 1.2,
                  ),
                ),
              ),
              const SizedBox(height: 24),
              TextButton(
                onPressed: () => Navigator.of(context).pop(),
                child: const Padding(
                  padding:
                      EdgeInsets.symmetric(horizontal: 32, vertical: 8),
                  child: Text(
                    'Got it',
                    style: TextStyle(
                      color: Color(0xFF7C5CBF),
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }
}
