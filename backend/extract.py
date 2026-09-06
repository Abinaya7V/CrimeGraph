import spacy
import re
import json

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Downloading language model for the spacy POS tagger")
    from spacy.cli import download
    download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

# Fallback for Indian place names spaCy's small model sometimes mislabels (e.g., 'Coimbatore' tagged as ORG instead of GPE).
INDIAN_LOCATIONS = [
    "Chennai", "Mumbai", "Bengaluru", "Bangalore", "Coimbatore", "Delhi", 
    "Kolkata", "Hyderabad", "Pune", "Kochi", "Kerala", "Tamil Nadu", 
    "Karnataka", "Indiranagar", "Bandra", "Mysuru", "Madurai"
]

def gazetteer_locations(text: str) -> list[str]:
    return [city for city in INDIAN_LOCATIONS if city.lower() in text.lower()]

def extract_entities(text: str) -> dict:
    doc = nlp(text)
    
    persons = set()
    
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            persons.add(ent.text)
            
    spacy_locations = [ent.text for ent in doc.ents if ent.label_ in ["GPE", "LOC"]]
    locations = list(set(spacy_locations + gazetteer_locations(text)))
            
    # Regex for Indian phone numbers: +91 followed by 10 digits, or just 10 digits starting with 6-9
    # Example: 9876543210, +919876543210, +91-9876543210, +91 9876543210
    phone_pattern = r"(?:\+91[-\s]?)?\b[6-9]\d{9}\b"
    
    phone_numbers = set(re.findall(phone_pattern, text))
    
    # Regex for Indian vehicle registration numbers
    # Format: TN-09-AB-4521, TN09AB4521, TN 09 AB 4521
    vehicle_pattern = r"\b[A-Z]{2}[-\s]?\d{2}[-\s]?[A-Z]{1,2}[-\s]?\d{4}\b"
    vehicle_numbers = set(re.findall(vehicle_pattern, text))
    
    return {
        "persons": list(persons),
        "locations": list(locations),
        "phone_numbers": list(phone_numbers),
        "vehicle_numbers": list(vehicle_numbers)
    }

if __name__ == "__main__":
    sample_texts = [
        "On 14th August, a suspicious vehicle bearing registration TN-09-AB-4521 was seen near the central bank in Chennai. The driver, Ravi Kumar, was seen talking on his mobile 9876543210.",
        "A robbery was reported by Suresh at the main street of Mumbai. The suspects fled in a white car, MH-12-PQ-9988. Suresh's contact number is +91-8899776655."
    ]
    
    for i, sample in enumerate(sample_texts):
        print(f"--- Sample {i+1} ---")
        print("Text:", sample)
        entities = extract_entities(sample)
        print("Extracted Entities:", json.dumps(entities, indent=2))
        print()
