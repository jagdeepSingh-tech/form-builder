/**
 * Finds the range of the section containing the field at the given index.
 * A section range implies the section header and all fields below it until the next section header.
 * If the field at index is a section header, the range starts there.
 */
export const getSectionRange = (fields, index) => {
    if (index < 0 || index >= fields.length) return null;

    // Find start: look backwards for 'section' type
    let startIndex = index;
    while (startIndex >= 0 && fields[startIndex].type !== "section") {
        startIndex--;
    }

    // If no section found upwards (orphaned fields at top), start at 0
    if (startIndex < 0) startIndex = 0;

    // Find end: look forwards for next 'section' type
    let endIndex = index + 1;
    while (endIndex < fields.length && fields[endIndex].type !== "section") {
        endIndex++;
    }

    return { startIndex, endIndex }; // endIndex is exclusive for slice but inclusive conceptually for range check? Usually exclusive for loops.
    // actually for boundary checks we want the valid indices. So let's return { min, max } inclusive.
    // Let's refine:
    // startIndex: index of the section header (or 0 if none)
    // endIndex: index of the last field in the section
};

/**
 * Returns the valid drag range for a specific item.
 * If item is a normal field: can be dragged anywhere within its current section.
 * If item is a section header: cannot be dragged inside another section (logic implies moving whole block).
 */
export const getDragBoundaries = (fields, index) => {
    if (index < 0 || index >= fields.length) return null;
    const item = fields[index];

    if (item.type === "section") {
        return { min: 0, max: fields.length }; // Sections can be moved anywhere generally (reordering blocks)
    }

    // It's a field. Find its section.
    let start = index;
    // Walk back to find section header
    while (start >= 0 && fields[start].type !== "section") {
        start--;
    }

    // Valid range starts AFTER the section header (start + 1)
    // If no header (start === -1), valid range starts at 0.
    const validMin = start === -1 ? 0 : start + 1;

    // Find next section to define max
    let end = index + 1;
    while (end < fields.length && fields[end].type !== "section") {
        end++;
    }
    // Valid range ends before the next section
    const validMax = end; // exclusive

    return { min: validMin, max: validMax };
};


/**
 * Reorders the fields array based on drag source and target.
 * Handles section block movement if source is a section.
 */
export const reorderFields = (fields, sourceIndex, targetIndex) => {
    if (sourceIndex === targetIndex) return fields;

    const sourceItem = fields[sourceIndex];
    const newFields = [...fields];

    if (sourceItem.type === "section") {
        // MOVING A SECTION BLOCK
        // 1. Identify valid block range (header + children)
        let blockEnd = sourceIndex + 1;
        while (blockEnd < fields.length && fields[blockEnd].type !== "section") {
            blockEnd++;
        }
        // block is [sourceIndex, blockEnd)
        const blockSize = blockEnd - sourceIndex;
        const block = newFields.splice(sourceIndex, blockSize);

        // 2. Adjust targetIndex if it shifted due to splice
        // If we removed from before target, target index decreases
        // Logic: if dropping further down, we basically want to insert at targetIndex - blockSize?
        // Actually, if we drop ON a section header at targetIndex, we want to insert BEFORE it? 
        // Or AFTER? 
        // If source < target: we dragged down. 
        // Original targetIndex is index of item we dropped ON.
        // We want to insert 'block' such that it pushes that item down. 
        // Since we removed 'blockSize' items from BEFORE targetIndex, the effective index of that target item shifted by -blockSize.
        // So insertion point should be targetIndex - blockSize.

        let insertionIndex = targetIndex;
        if (sourceIndex < targetIndex) {
            insertionIndex -= blockSize;
        }

        newFields.splice(insertionIndex, 0, ...block);
        return newFields;
    } else {
        // MOVING A SINGLE FIELD
        // Remove item
        const [removed] = newFields.splice(sourceIndex, 1);

        // Adjust targetIndex if we are moving down (source < target)
        // Because removing the item shifted correctly aligned subsequent items down by 1.
        // We want to insert *before* the item that was originally at targetIndex.
        // That item uses index (targetIndex - 1) now.
        let insertionIndex = targetIndex;
        if (sourceIndex < targetIndex) {
            insertionIndex -= 1;
        }

        // Insert at target
        newFields.splice(insertionIndex, 0, removed);
        return newFields;
    }
};
