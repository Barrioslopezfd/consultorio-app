package main

import "os"

func handleStart() {
	newDir("./.config/consultorio-app")
}

func newDir(relativePath string) {
	if _, err := os.Stat(relativePath); os.IsNotExist(err) {
		os.MkdirAll(relativePath, 0o700)
	}
}

func newFile(relativePath string, fileName string) {
	
	fullPath := relativePath
	if _, err := os.WriteFile
}
