// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use rand::prelude::*;
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::fs::{create_dir, write, File};
use std::io::Read;
use std::path::PathBuf;
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[derive(Clone, Serialize, Deserialize)]
struct UserRecord {
    max_score: u16,
}

#[tauri::command]
fn initiate_matrix() -> Vec<Vec<u16>> {
    let mut rng = rand::thread_rng();
    let mut origin: Vec<u16> = vec![0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0];
    origin.shuffle(&mut rng);

    let mut res: Vec<Vec<u16>> = vec![];

    for row in origin.chunks(4) {
        res.push(row.to_vec());
    }

    res
}

#[tauri::command]
fn shift_right(matrix: Vec<Vec<u16>>) -> (Vec<Vec<u16>>, u16) {
    let mut shift_right = vec![];
    let mut total_score = 0;

    for row in matrix.iter() {
        let (single_row, score) = shift_right_row(row.to_vec());
        shift_right.push(single_row);
        total_score += score;
    }

    if shift_right != matrix {
        add_number(&mut shift_right);
    }

    (shift_right, total_score)
}

#[tauri::command]
fn shift_left(matrix: Vec<Vec<u16>>) -> (Vec<Vec<u16>>, u16) {
    let mut shift_left = vec![];
    let mut total_score = 0;

    for row in matrix.iter() {
        let (single_row, score) = shift_left_row(row.to_vec());
        shift_left.push(single_row);
        total_score += score;
    }

    if shift_left != matrix {
        add_number(&mut shift_left);
    }

    (shift_left, total_score)
}

#[tauri::command]
fn shift_up(matrix: Vec<Vec<u16>>) -> (Vec<Vec<u16>>, u16) {
    let mut shift_up = vec![];
    let n = matrix.len();
    let mut total_score = 0;

    for c in 0..n {
        let mut tmp = vec![];
        for r in (0..n).rev() {
            tmp.push(matrix[r][c]);
        }
        let (single_row, score) = shift_right_row(tmp);
        shift_up.push(single_row);
        total_score += score;
    }

    shift_up = rotate_left(shift_up);

    if shift_up != matrix {
        add_number(&mut shift_up);
    }

    (shift_up, total_score)
}

#[tauri::command]
fn shift_down(matrix: Vec<Vec<u16>>) -> (Vec<Vec<u16>>, u16) {
    let mut shift_down = vec![];
    let n = matrix.len();
    let mut total_score = 0;

    for c in 0..n {
        let mut tmp = vec![];
        for r in (0..n).rev() {
            tmp.push(matrix[r][c]);
        }
        let (single_row, score) = shift_left_row(tmp);
        shift_down.push(single_row);
        total_score += score;
    }

    shift_down = rotate_left(shift_down);

    if shift_down != matrix {
        add_number(&mut shift_down)
    }

    (shift_down, total_score)
}

#[tauri::command]
fn write_record(app_handle: tauri::AppHandle, max_score: u16) -> String {
    let binding = app_handle.path_resolver().app_data_dir().unwrap();

    let file_path = PathBuf::from(binding).join("records.json");
    let _ = std::fs::write(&file_path, json!({
        "max_score": max_score
    }).to_string());
    file_path.to_str().unwrap().to_string()

}

#[tauri::command]
fn read_record(app_handle: tauri::AppHandle) -> String {
    let binding = app_handle.path_resolver().app_data_dir().unwrap();
    let file_path = PathBuf::from(binding).join("records.json");
    match File::open(&file_path).and_then(|mut file| {
        let mut data = String::new();
        file.read_to_string(&mut data)?;
        return Ok(data);
    }) {
        Ok(data) => {data}
        Err(_) => {
            json!({
                "max_score": 0
            }).to_string()
        }
    }

    
}


fn rotate_left(matrix: Vec<Vec<u16>>) -> Vec<Vec<u16>> {
    let n = matrix.len();
    let mut res = vec![];

    for c in (0..n).rev() {
        let mut tmp = vec![];
        for r in 0..n {
            tmp.push(matrix[r][c]);
        }
        res.push(tmp);
    }

    res
}

#[tauri::command]
fn check_game_state(matrix: Vec<Vec<u16>>) -> String {
    let n = matrix.len();

    for r in 0..n {
        for c in 0..n {
            if matrix[r][c] == 0 {
                return "continue".to_string();
            }

            if matrix[r][c] == 2048 {
                return "win".to_string();
            }

            // Go right
            if c != n - 1 {
                if matrix[r][c + 1] == matrix[r][c] {
                    return "continue".to_string();
                }
            }

            // Go down
            if r != n - 1 {
                if matrix[r + 1][c] == matrix[r][c] {
                    return "continue".to_string();
                }
            }
        }
    }

    "lose".to_string()
}

fn add_number(matrix: &mut Vec<Vec<u16>>) {
    let mut zeros = vec![];
    let n = matrix.len();

    for r in 0..n {
        for c in 0..n {
            if matrix[r][c] == 0 {
                zeros.push((r, c));
            }
        }
    }
    if !zeros.is_empty() {
        let mut rng = rand::thread_rng();
        zeros.shuffle(&mut rng);
        let (r, c) = zeros.pop().unwrap();
        matrix[r][c] = 2;
    }
}

fn shift_right_row(mut row: Vec<u16>) -> (Vec<u16>, u16) {
    let mut new_row: Vec<u16> = vec![];
    let mut score = 0;
    let n = row.len();
    let mut tmp = 0;
    while !row.is_empty() {
        let cur = row.pop().unwrap();
        if cur != 0 {
            if cur == tmp {
                tmp <<= 1;
                score += tmp;
                new_row.push(tmp);
                tmp = 0;
            } else {
                if tmp != 0 {
                    new_row.push(tmp);
                }
                tmp = cur;
            }
        }
    }
    if tmp != 0 {
        new_row.push(tmp);
    }

    new_row.append(&mut vec![0; n - new_row.len()]);
    new_row.reverse();
    (new_row, score)
}

fn shift_left_row(row: Vec<u16>) -> (Vec<u16>, u16) {
    let mut score = 0;
    let mut new_row: Vec<u16> = vec![];
    let n = row.len();
    let mut tmp = 0;
    for num in row.into_iter() {
        if num != 0 {
            if num == tmp {
                tmp <<= 1;
                score += tmp;
                new_row.push(tmp);
                tmp = 0;
            } else {
                if tmp != 0 {
                    new_row.push(tmp);
                }
                tmp = num;
            }
        }
    }
    if tmp != 0 {
        new_row.push(tmp);
    }

    new_row.append(&mut vec![0; n - new_row.len()]);
    (new_row, score)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            initiate_matrix,
            shift_right,
            shift_up,
            shift_left,
            shift_down,
            check_game_state,
            write_record,
            read_record
        ])
        .setup(|app| match app.path_resolver().app_data_dir() {
            Some(data_dir) => {
                let _ = create_dir(&data_dir);
                Ok(())
            }
            None => Ok(()),
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test1() {
        dbg!(shift_down(vec![
            vec![2, 0, 0, 0],
            vec![32, 2, 0, 0],
            vec![2, 4, 16, 4],
            vec![4, 4, 2, 0]
        ]));
    }
}
