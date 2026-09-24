'use client';

import { useState, useEffect } from 'react';
import {
  X,
  Activity,
  Radio,
  Battery,
  Cpu,
  Compass,
  Wifi,
  Play,
  Pause,
  Terminal,
} from 'lucide-react';

interface TelemetryModalProps {
  onClose: () => void;
}

interface Packet {
  id: string;
  time: string;
  canId: string;
  type: string;
  data: string;
  status: 'NOMINAL' | 'WARN' | 'DATA';
}

export function TelemetryModal({ onClose }: TelemetryModalProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [pitch, setPitch] = useState(2.4);
  const [roll, setRoll] = useState(-1.1);
  const [yaw, setYaw] = useState(148.5);
  const [batteryVoltage, setBatteryVoltage] = useState(25.1);
  const [gpuLoad, setGpuLoad] = useState(48);
  const [packets, setPackets] = useState<Packet[]>([
    { id: '1', time: '00:00:01', canId: '0x140', type: 'MOTOR_FL_VEL', data: 'RPM: 1840 | Cur: 2.1A', status: 'NOMINAL' },
    { id: '2', time: '00:00:02', canId: '0x141', type: 'MOTOR_FR_VEL', data: 'RPM: 1844 | Cur: 2.2A', status: 'NOMINAL' },
    { id: '3', time: '00:00:02', canId: '0x220', type: 'IMU_BNO085', data: 'Roll: -1.1° | Pitch: 2.4°', status: 'NOMINAL' },
    { id: '4', time: '00:00:03', canId: '0x310', type: 'BMS_6S_PACK', data: 'V: 25.1V | T: 31.4°C', status: 'NOMINAL' },
    { id: '5', time: '00:00:03', canId: '0x405', type: 'LIDAR_SCAN', data: 'Pts: 24,500 | 15.0 Hz', status: 'DATA' },
  ]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      // Simulate slight IMU noise
      setPitch((p) => +(p + (Math.random() - 0.5) * 0.4).toFixed(1));
      setRoll((r) => +(r + (Math.random() - 0.5) * 0.3).toFixed(1));
      setYaw((y) => +((y + 0.2) % 360).toFixed(1));
      setGpuLoad(Math.floor(45 + Math.random() * 15));
      setBatteryVoltage((v) => +(Math.max(24.0, v - 0.001)).toFixed(2));

      // Append real-time mock CAN bus packet
      const now = new Date().toTimeString().split(' ')[0];
      const canIds = [
        { id: '0x140', type: 'MOTOR_FL_VEL', data: `RPM: ${1800 + Math.floor(Math.random() * 80)} | Cur: ${(1.9 + Math.random() * 0.4).toFixed(2)}A`, status: 'NOMINAL' as const },
        { id: '0x220', type: 'IMU_QUAT', data: `Pitch: ${(Math.random() * 3).toFixed(1)}° | Yaw: ${(Math.random() * 360).toFixed(1)}°`, status: 'NOMINAL' as const },
        { id: '0x310', type: 'BMS_CELL_V', data: `Min: 4.18V | Max: 4.19V | Bal: OK`, status: 'NOMINAL' as const },
        { id: '0x405', type: 'SLAM_ODOM', data: `X: ${(12.4 + Math.random() * 0.1).toFixed(2)}m | Y: ${(8.1 + Math.random() * 0.1).toFixed(2)}m`, status: 'DATA' as const },
      ];
      const chosen = canIds[Math.floor(Math.random() * canIds.length)];

      setPackets((prev) => [
        {
          id: Math.random().toString(36).slice(2, 7),
          time: now,
          canId: chosen.id,
          type: chosen.type,
          data: chosen.data,
          status: chosen.status,
        },
        ...prev.slice(0, 14),
      ]);
    }, 800);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col w-full max-w-5xl max-h-[90vh] rounded-2xl border border-border bg-bg-0 shadow-2xl overflow-hidden font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-border/80 bg-surface/90 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent-2/40 bg-accent-2/10 text-accent-2">
              <Radio className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-text-1">TRAIC TELEMETRY GROUND STATION</span>
                <span className="rounded bg-success/20 px-2 py-0.5 text-[10px] font-bold text-success border border-success/30">
                  LIVE SIMULATION
                </span>
              </div>
              <p className="text-xs text-text-2">Sub-millisecond CAN-FD & WebSockets Fleet Monitor</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-text-2 hover:text-text-1"
              title={isPaused ? 'Resume stream' : 'Pause stream'}
            >
              {isPaused ? <Play className="h-3.5 w-3.5 text-success" /> : <Pause className="h-3.5 w-3.5 text-accent" />}
              <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg border border-border bg-surface p-1.5 text-text-2 hover:bg-surface-hover hover:text-text-1 transition-colors"
              aria-label="Close telemetry monitor"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Live Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-border bg-surface/60 p-4">
              <div className="flex items-center justify-between text-xs text-text-2 mb-1">
                <span>BATTERY PACK</span>
                <Battery className="h-4 w-4 text-success" />
              </div>
              <div className="text-2xl font-black text-text-1">{batteryVoltage} V</div>
              <div className="text-[11px] text-success mt-1">6S LiFePO4 • 96% Health</div>
            </div>

            <div className="rounded-xl border border-border bg-surface/60 p-4">
              <div className="flex items-center justify-between text-xs text-text-2 mb-1">
                <span>NVIDIA ORIN GPU</span>
                <Cpu className="h-4 w-4 text-accent-2" />
              </div>
              <div className="text-2xl font-black text-text-1">{gpuLoad}%</div>
              <div className="text-[11px] text-accent-2 mt-1">Hailo-8 NPU @ 26 TOPS</div>
            </div>

            <div className="rounded-xl border border-border bg-surface/60 p-4">
              <div className="flex items-center justify-between text-xs text-text-2 mb-1">
                <span>IMU ORIENTATION</span>
                <Compass className="h-4 w-4 text-accent" />
              </div>
              <div className="text-xl font-black text-text-1">
                P:{pitch}° R:{roll}°
              </div>
              <div className="text-[11px] text-accent mt-1">Heading: {yaw}° True N</div>
            </div>

            <div className="rounded-xl border border-border bg-surface/60 p-4">
              <div className="flex items-center justify-between text-xs text-text-2 mb-1">
                <span>CAN-FD BUS</span>
                <Wifi className="h-4 w-4 text-success" />
              </div>
              <div className="text-2xl font-black text-text-1">5.0 Mbps</div>
              <div className="text-[11px] text-success mt-1">0 Frame Drops • &lt; 0.8ms</div>
            </div>
          </div>

          {/* Real-time CAN Stream & System Architecture */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Packet Log Terminal */}
            <div className="lg:col-span-2 rounded-xl border border-border bg-bg-1/90 p-4">
              <div className="flex items-center justify-between border-b border-border/80 pb-2.5 mb-3 text-xs">
                <div className="flex items-center gap-2 text-text-1 font-bold">
                  <Terminal className="h-4 w-4 text-accent-2" />
                  <span>CAN-FD INCOMING STREAM // 0x100-0x500</span>
                </div>
                <div className="flex items-center gap-1.5 text-success text-[10px]">
                  <Activity className="h-3 w-3 animate-pulse" />
                  <span>RECEIVING 250 HZ</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs overflow-x-auto">
                <div className="grid grid-cols-12 text-[10px] text-text-2 font-bold uppercase pb-1 border-b border-border/50">
                  <span className="col-span-2">TIMESTAMP</span>
                  <span className="col-span-2">CAN ID</span>
                  <span className="col-span-4">FRAME TYPE</span>
                  <span className="col-span-4">PAYLOAD</span>
                </div>
                {packets.map((p) => (
                  <div
                    key={p.id}
                    className="grid grid-cols-12 items-center py-1 text-[11px] transition-colors hover:bg-surface/50 rounded px-1"
                  >
                    <span className="col-span-2 text-text-2">{p.time}</span>
                    <span className="col-span-2 font-bold text-accent-2">{p.canId}</span>
                    <span className="col-span-4 text-accent font-semibold">{p.type}</span>
                    <span className="col-span-4 text-text-1 truncate">{p.data}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Architecture Node Health */}
            <div className="rounded-xl border border-border bg-surface/60 p-4 space-y-4">
              <div className="text-xs font-bold text-text-1 border-b border-border/80 pb-2">
                SUB-SYSTEM LINK STATUS
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-text-2">ROS2 Micro-Agent</span>
                  <span className="text-success font-bold">SYNCED (STM32H7)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-2">RTAB-Map 3D SLAM</span>
                  <span className="text-success font-bold">LOCALIZED (0.02m)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-2">LoRa 868MHz Uplink</span>
                  <span className="text-accent-2 font-bold">-68 dBm (EXCELLENT)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-2">Differential Motor Drivers</span>
                  <span className="text-success font-bold">4/4 ACTIVE</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-2">Safety Heartbeat Watchdog</span>
                  <span className="text-success font-bold">OK (100ms)</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border/80 text-[11px] text-text-2 leading-relaxed">
                Platform engineered by TRAIC members for real-time robotic fleet tracking, field trial data harvesting, and competition telemetry.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
