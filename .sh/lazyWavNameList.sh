#!/bin/sh

# Set the directory path
directory="./.wav"

# Create JavaScript array variable
echo "export const wavURLs = [" > "./.js/wavUrl.js"

# List files without extensions in the specified directory
for file in "$directory"/*; do
  # Check if the file has an extension
  if [ ! -f "$file" ]; then
    continue
  fi

  # Get the file name without the extension
  fileName=$(basename "${file%.*}")

  # Append the file name to the fileNames variable
  fileNames="$fileNames,\"$fileName\""
done

# Close the JavaScript array variable
fileNames="${fileNames:1}"
echo "$fileNames];" >> "./.js/wavUrl.js"