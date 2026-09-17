"use client";

import { useState } from "react";
import Modal from "./Modal";
import { SIZE_TABLE } from "@/lib/content";

export default function SizeGuideModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs font-semibold text-[#7A2A3D] underline-offset-4 hover:underline cursor-pointer"
      >
        Size Guide
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Size Guide">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line">
                {SIZE_TABLE.head.map((label) => (
                  <th
                    key={label}
                    className="whitespace-nowrap py-2 pr-4 text-xs font-bold tracking-wider text-charcoal uppercase"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {SIZE_TABLE.rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) => (
                    <td key={i} className="whitespace-nowrap py-2.5 pr-4 text-muted">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-muted">
          Between two sizes? Take the smaller band and the larger cup — a
          firm band is what holds a bra up.
        </p>
      </Modal>
    </>
  );
}
