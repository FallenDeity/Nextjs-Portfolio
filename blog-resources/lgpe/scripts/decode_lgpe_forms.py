#!/usr/bin/env python3
"""Decode LGPE ZKN_FORM labels and list GFPAK suffixes for each species."""

import argparse
import csv
import hashlib
import re
import struct
import sys
from collections import defaultdict
from pathlib import Path

from decode_lgpe_monsname import decode_dat, read_ahtb


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "dump_root",
        nargs="?",
        type=Path,
        default=Path("."),
        help="extracted LGPE dump root (default: current directory)",
    )
    parser.add_argument("--out", type=Path, help="write TSV here; omit to print TSV to stdout")
    parser.add_argument("--force", action="store_true", help="allow replacing an existing output")
    args = parser.parse_args()

    common = args.dump_root / "romfs/bin/message/English/common"
    dat_path = common / "zkn_form.dat"
    tbl_path = common / "zkn_form.tbl"
    pak_dir = args.dump_root / "romfs/bin/archive/pokemon"

    try:
        names = decode_dat(dat_path)
        labels, parsed_end, tbl_size = read_ahtb(tbl_path)
        suffixes_by_species = defaultdict(set)
        if pak_dir.is_dir():
            for pak in pak_dir.glob("pm*.gfpak"):
                match = re.fullmatch(r"pm(\d{4})_(\d{2})(?:_(\d{2}))?", pak.stem)
                if match:
                    species_index = int(match.group(1))
                    suffixes_by_species[species_index].add(match.group(2))

        rows = []
        for entry, label in enumerate(labels):
            match = re.fullmatch(r"ZKN_FORM_(\d+)_(\d+)", label)
            if not match:
                continue
            species_index, form_index = (int(value) for value in match.groups())
            name = names[entry] if entry < len(names) else ""
            suffixes = ",".join(sorted(suffixes_by_species[species_index]))
            rows.append((species_index, form_index, label, name, suffixes))

        if args.out and args.out.exists() and not args.force:
            raise FileExistsError("{} exists; pass --force to replace it".format(args.out))
        if args.out:
            args.out.parent.mkdir(parents=True, exist_ok=True)
            output = args.out.open("w", encoding="utf-8", newline="")
        else:
            output = sys.stdout
        try:
            writer = csv.writer(output, delimiter="\t", lineterminator="\n")
            writer.writerow(
                ("species_index", "form_index", "label", "english_form_name", "observed_gfpak_suffixes_for_species")
            )
            writer.writerows(rows)
        finally:
            if args.out:
                output.close()

        if args.out:
            print("Wrote {}".format(args.out))
        print(
            "Form labels: {}; DAT strings: {}; TBL labels: {}".format(len(rows), len(names), len(labels)),
            file=sys.stderr,
        )
        print("DAT SHA-256: {}".format(sha256(dat_path)), file=sys.stderr)
        print("TBL SHA-256: {}".format(sha256(tbl_path)), file=sys.stderr)
        print("AHTB parse ended at 0x{:x} of 0x{:x} bytes.".format(parsed_end, tbl_size), file=sys.stderr)
        print("Suffixes are listed per species; this script does not map a suffix to a form index.", file=sys.stderr)
    except (OSError, ValueError, struct.error) as exc:
        parser.error(str(exc))


if __name__ == "__main__":
    main()
